const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const House = sequelize.define('House', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, // Uzın tekst ushın
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat: { // Karta ushın kenglik
        type: DataTypes.FLOAT,
        allowNull: true
    },
    lng: { // Karta ushın uzınlıq
        type: DataTypes.FLOAT,
        allowNull: true
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL massiv qollaydı
        defaultValue: []
    },
    rooms: {
        type: DataTypes.INTEGER, // Bólme sanı
        allowNull: false,
        defaultValue: 1
    },
    amenities: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Wifi, Gaz, Tok, Kondicioner...
        defaultValue: []
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Qosılǵanda hámishe "Bos" (True) boladı
        allowNull: false
    }
});

module.exports = House;