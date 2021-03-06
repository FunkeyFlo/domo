"use strict";

module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        title: DataTypes.STRING,
        cmd: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Task.belongsTo(models.Command);
            }
        }
    });

    return Task;
};
