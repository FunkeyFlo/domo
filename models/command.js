"use strict";

module.exports = function(sequelize, DataTypes) {
    var Command = sequelize.define("Command", {
        title: DataTypes.STRING,
        expression: DataTypes.STRING,
        response: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Command.hasMany(models.Task)
            }
        }
    });

    return Command;
};
