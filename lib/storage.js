/*
 * Main Storage controller. Encapsulates all ORM/Waterline stuff.
 */

/*
 * Module dependencies.
 */
var Waterline = require('waterline');
var pranaAdapter = require('waterline-prana');
var mongoAdapter = require('sails-mongo');
var utils = require('prana').utils;
var modelPatch = require('./model-patch');
var adapterMethods = require('./adapter-patch');

/**
 * Main Storage controller class.
 *
 * @class Storage
 */
var Storage = module.exports = function(application) {
  this.application = application;

  // Create Waterline instance.
  this.waterline = new Waterline();
};

/**
 * Initialize the Storage at a given port.
 *
 * @param {Number} port Port number.
 * @param {Function} [callback] Optional callback to run when the Storage is initialized.
 */
Storage.prototype.init = function(callback) {
  // Add methods not implemented in waterline-prana that we need for
  // overrides to be persisted.
  utils.extend(pranaAdapter, adapterMethods(this.application));

  // Pass Choko instance to the Prana Waterline adapter.
  pranaAdapter.setApplication(this.application);

  var config = {
    adapters: {
      'prana': pranaAdapter,
      'mongo': mongoAdapter
    },
    connections: {
      'prana': {
        adapter: 'prana'
      },
      'mongo': {
        adapter: 'mongo',
        url: this.application.settings.database
      }
    }
  };

  // Initialize Waterline ORM.
  var application = this.application;
  this.waterline.initialize(config, function(error, models) {
    if (error) {
      return callback(error);
    }

    // Waterline lowercase all collection names so we need to fix mappings
    // to make them consistent.
    var collections = {};
    for (var collectionName in models.collections) {
      var collection = models.collections[collectionName];
      var schema = collection.waterline.schema[collectionName];

      // Add type and application object to collections.
      collection.application = application;
      collection.type = application.types[schema.tableName];

      collections[schema.tableName] = collection;
    }

    callback(null, collections);
  });
};

Storage.prototype.type = function(name, settings) {
  // Create schema and register it in Waterline.
  var schema = {
    identity: name,
    tableName: name,
    schema: false,

    // @todo: allow extensions to add storages/connections/adapters.
    connection: (settings.storage == 'database' ? 'mongo' : 'prana'),

    // Disable automatic migration.
    migrate: 'safe',

    // Disable auto primary key and created/update.
    autoPK: (!settings.keyProperty),
    autoCreatedAt: false,
    autoUpdatedAt: false,

    // Initialize attibutes.
    attributes: {}
  };

  if (settings.fields) {
    this.processFields(schema, settings);
  }

  // Add validation related methods.
  // @todo: rename this something else than patch, since it's not this anymore.
  utils.extend(schema, modelPatch);

  var application = this.application;

  // Generate callbacks for all Waterline lifecycle callbacks.
  var callbackFactory = function(when, operation) {
    return function(values, callback) {
      var callbackName = when + operation;

      // Call type callback.
      if (callbackName in settings) {
        return settings[callbackName](settings, values, function() {
          // Invoke hook on all extensions.
          application.invoke(callbackName, name, values, callback);
        });
      }

      // Invoke hook on all extensions.
      application.invoke(callbackName, name, values, callback);
    };
  };

  // Add before/after callbacks.
  ['Validate', 'Update', 'Create', 'Destroy'].map(function(operation) {
    ['before', 'after'].map(function(when) {
      var callbackName = when + operation;
      schema[callbackName] = callbackFactory(when, operation);
    });
  });

  // Add type specific collection methods.
  if (settings.statics && schema.attributes) {
    utils.extend(schema, settings.statics);
  }

  // Add type methods to model.
  if (settings.methods && schema.attributes) {
    utils.extend(schema.attributes, settings.methods);
  }

  this.processAssociations(schema, settings);

  var collection = Waterline.Collection.extend(schema);

  // Load the collection into Waterline.
  this.waterline.loadCollection(collection);

  return collection;
};

Storage.prototype.processFields = function(schema, settings) {
  // Create attributes for all type fields.
  for (fieldName in settings.fields) {
    var fieldSettings = settings.fields[fieldName];

    if (fieldSettings.type == 'reference' && fieldSettings.reference) {
      this.processReferenceField(schema, settings, fieldName, fieldSettings);
    }
    else {
      this.processScalarField(schema, settings, fieldName, fieldSettings);
    }
  }
};

Storage.prototype.processReferenceField = function(schema, settings, fieldName, fieldSettings) {
  if (fieldSettings.reference.inline) {
    // Use 'array' or 'json' for inline references.
    schema.attributes[fieldName] = {
      type: fieldSettings.reference.multiple ? 'array' : 'json'
    };
  } else if (fieldSettings.reference.via) {
    schema.attributes[fieldName] = {
      type: fieldSettings.reference.multiple ? 'collection' : 'model',
      via: fieldSettings.reference.via
    };
  } else {
    if (fieldSettings.reference.multiple) {

      if (fieldSettings.reference.forceArray) {
        schema.attributes[fieldName] = {
          type: 'array'
        };
      } else {
        schema.attributes[fieldName] = {
          // Many-to-many relationships will just use array for now, since
          // waterline does not support many to many relatioships with
          // embbeded documents.
          // @todo: eventually we may be able to use something like this.
          collection: fieldSettings.reference.type,
          dominant: true,
          // type: 'array'
        };
      }
    } else {
      schema.attributes[fieldName] = {
        model: fieldSettings.reference.type
      };
    }
  }

  if ('required' in fieldSettings) {
    schema.attributes[fieldName].required = fieldSettings.required;
  }
};

Storage.prototype.processScalarField = function(schema, settings, fieldName, fieldSettings) {
  var field = this.application.fields[fieldSettings.type];
  var primaryKey = (settings.keyProperty == fieldName);
  var attribute = schema.attributes[fieldName] = {
    // Default type to string.
    type: 'string'
  };

  if (field.schema) {
    switch (typeof field.schema) {

      // If schema is a string it's the attribute type.
      case 'string':
        utils.extend(attribute, {
          type: field.schema
        });
        break;

      // If schema is a object it's the attribute settings object.
      case 'object':
        utils.extend(attribute, field.schema);
        break;

      // If schema is a function run it to get the attribute settings
      // object.
      case 'function':
        utils.extend(attribute, field.schema(fieldSettings));
        break;
    }
  }

  // Add required, unique, index and protected properties if set.
  ['required', 'unique', 'index', 'protected'].map(function(what) {
    if (what in fieldSettings) {
      attribute[what] = fieldSettings[what];
    }
  });

  if (primaryKey) {
    attribute.primaryKey = true;
    attribute.unique = true;
    attribute.index = true;

    // Make sure key fields are unique on field settings too.
    fieldSettings.unique = true;
    fieldSettings.index = true;
  }
};

Storage.prototype.processAssociations = function(schema, settings) {
  var associatedWith = [];
  var self = this;

  // Derive information about this collection associations from its schema
  // and attach/expose the metadata as `SomeCollection.associations` (an array)
  Object.keys(schema.attributes).forEach(function(name) {
    var attrDefinition = schema.attributes[name];
    var existKeyProperty;
    var association;
    var assoc;

    if (typeof attrDefinition === 'object' && (attrDefinition.model || attrDefinition.collection)) {

      assoc = {
        alias: name,
        type: attrDefinition.model ? 'model' : 'collection'
      };

      if (attrDefinition.model) {
        assoc.model = attrDefinition.model;
        association = self.application.types[attrDefinition.model];
        existKeyProperty = association && association.keyProperty;
      }

      if (attrDefinition.collection) {
        assoc.collection = attrDefinition.collection;
        association = self.application.types[attrDefinition.collection];
        existKeyProperty = association && association.keyProperty;
      }

      if (attrDefinition.via) {
        assoc.via = attrDefinition.via;
        // association = self.application.types[attrDefinition.via];
        // existKeyProperty = association && association.keyProperty;
      }

      if (existKeyProperty) {
        assoc.keyProperty = association.keyProperty;
      }

      associatedWith.push(assoc);
    }
  });

  schema.associations = associatedWith;
};
