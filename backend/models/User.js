const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Bir email menen eki ret dizimnen ótiwge bolmaydı
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'admin', 'client'),
        defaultValue: 'client', // Hesh nárse tańlamasa, avtomat 'client' boladı
        allowNull: false
    },
    houseLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 2, // Ádettegi admin 2 úy qosa aladı
        allowNull: false
    }
});

module.exports = User;