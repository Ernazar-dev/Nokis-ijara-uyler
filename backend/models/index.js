const { sequelize } = require('../config/db');
const User = require('./User');
const House = require('./House');
const Favorite = require('./Favorite'); // Jańa model

// 1. User - House (Admin úy qosıwı)
User.hasMany(House, { foreignKey: 'userId', onDelete: 'CASCADE' });
House.belongsTo(User, { foreignKey: 'userId' });

// 2. Favorites (Like basıw)
// Bir User kóp úydi unaatadı
User.belongsToMany(House, { through: Favorite, as: 'LikedHouses', foreignKey: 'userId' });
// Bir Úydi kóp User unaatadı
House.belongsToMany(User, { through: Favorite, as: 'LikedBy', foreignKey: 'houseId' });

module.exports = {
    sequelize,
    User,
    House,
    Favorite
};