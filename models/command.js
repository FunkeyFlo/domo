"use strict";

module.exports = function(sequelize, DataTypes) {
    var Command = sequelize.define("Command", {
        text: DataTypes.STRING,
        response: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Command.belongsTo(models.Task)
            }
        }
    });

    return Command;
};
