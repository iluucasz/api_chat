const { Model, DataTypes } = require('sequelize')

class User extends Model {
  static init(sequelize) {
    super.init({
      firstName: {
        type: DataTypes.STRING,
        field: 'firstName'
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'lastName'
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: false, // Disabling the conversion to snake_case
    });
  }
}


module.exports = User;