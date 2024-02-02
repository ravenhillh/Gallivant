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
            model: 'tours',
            key: 'id'
        }
    }
}, { timestamps: true })

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
            key: 'id'
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

// console.log(User === db.models.User);

//   Table Users_Waypoints {
//     id_user int [ref: - Users.id]
//     id_waypoint int [ref: - Waypoints.id]
//     status varchar
//   }

//   Table Waypoints {
//     id int [primary key]
//     description varchar
//     prompt varchar
//     answer varchar
//     long float
//     lat float
//     rating_avg float //denormalized?
//   }

//   Table Images_Waypoints {
//     id_waypoint int [ref: - Waypoints.id]
//     id_image int [ref: - Images.id]
//   }

//   Table Categories { //waypoint description
//     id int [primary key]
//     category varchar
//     icon varchar
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

//   Table Images {
//     id int [primary key]
//     id_user int [ref: > Users.id]
//     thumbnail varchar
//     large_img varchar
//   }

//   Table Images_Reviews {
//     id_review int [ref: - Reviews.id]
//     id_image int [ref: - Images.id]
//   }

//   Table Images_Tours {
//     id_tour int [ref: - Tours.id]
//     id_image int [ref: - Images.id]
//   }

//   Table Reviews {
//     id int [primary key]
//     id_user int [ref: > Users.id]
//     feedback varchar
//     rating int
//   }

//   Table Reviews_Tours {
//     id_review int [ref: - Reviews.id]
//     id_tour int [ref: - Tours.id]
//   }

//   Table Reviews_Waypoints {
//     id_review int [ref: - Reviews.id]
//     id_waypoint int [ref: - Waypoints.id]
//   }

//   Table Chats {
//     id int [primary key]
//     id_user int [ref: > Users.id]
//     message varchar
//   }

//   Table Chats_Tours {
//     id_chat int [ref: - Chats.id]
//     id_tour int [ref: - Tours.id]
//   } 


export default { db, Tour, User }