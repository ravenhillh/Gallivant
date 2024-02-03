const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize('gallivant', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})


db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error: string) => {
        console.error('Unable to connect to the database:', error);
    })


// CREATED USERS TABLE   
const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    id_currentTour: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Tours',
            key: 'id',
            allowNull: false
        }
    }
}, { timestamps: true })

// CREATED TOURS TABLE
const Tour = db.define('Tour', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_createdByUser: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
            allowNull: false
        }
    },
    type: DataTypes.STRING,
    ratingAvg: DataTypes.DECIMAL,
    tourName: DataTypes.STRING,
    isOrdered: DataTypes.BOOLEAN,
    neighborhood: DataTypes.STRING,
    completions: DataTypes.INTEGER,
    totalWaypoints: DataTypes.INTEGER,
    startLong: DataTypes.DECIMAL,
    startLat: DataTypes.DECIMAL
})


// CREATED WAYPOINTS TABLE
const Waypoint = db.define('Waypoint', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: DataTypes.TEXT,
    prompt: DataTypes.TEXT,
    answer: DataTypes.STRING,
    long: DataTypes.DECIMAL,
    lat: DataTypes.DECIMAL,
    ratingAvg: DataTypes.DECIMAL
})

// CREATED CATEGORIES TABLE
const Category = db.define('Category', { //waypoint description
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: DataTypes.STRING,
    icon: DataTypes.STRING
})

// CREATED IMAGES TABLE
const Image = db.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
            allowNull: false
        }
    },
    thumbnail: DataTypes.STRING,
    largeImg: DataTypes.STRING
})

// CREATED REVIEWS TABLE
const Review = db.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
            allowNull: false
        }
    },
    feedback: DataTypes.STRING,
    rating: DataTypes.INTEGER
})

// CREATED CHATS TABLE
const Chat = db.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
            allowNull: false
        }
    },
    message: DataTypes.STRING
})

//   Table Users_Waypoints {
//     id_user int [ref: - Users.id]
//     id_waypoint int [ref: - Waypoints.id]
//     status varchar
//   }

//   Table Images_Waypoints {
//     id_waypoint int [ref: - Waypoints.id]
//     id_image int [ref: - Images.id]
//   }


//   Table Waypoints_Categories {
//     id_waypoint int [ref: - Waypoints.id]
//     id_category int [ref: - Categories.id]
//   }


//   Table Tours_Waypoints {
//     id_tour int [ref: - Tours.id]
//     id_waypoint int [ref: - Waypoints.id]
//     order int
//   }

//   Table Completed_Tours {
//     id_tour int [ref: - Tours.id]
//     id_user int [ref: - Users.id]
//   }


//   Table Images_Reviews {
//     id_review int [ref: - Reviews.id]
//     id_image int [ref: - Images.id]
//   }

//   Table Images_Tours {
//     id_tour int [ref: - Tours.id]
//     id_image int [ref: - Images.id]
//   }


//   Table Reviews_Tours {
//     id_review int [ref: - Reviews.id]
//     id_tour int [ref: - Tours.id]
//   }

//   Table Reviews_Waypoints {
//     id_review int [ref: - Reviews.id]
//     id_waypoint int [ref: - Waypoints.id]
//   }


//   Table Chats_Tours {
//     id_chat int [ref: - Chats.id]
//     id_tour int [ref: - Tours.id]
//   } 
db.sync()

export default { db, Tour, User }