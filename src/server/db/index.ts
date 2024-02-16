const { Sequelize, DataTypes } = require('sequelize');

import dotenv from 'dotenv';
dotenv.config();

const sqlPw: string = process.env.SQL_PW ?? '';

const db = new Sequelize('gallivant', 'root', sqlPw, {
    host: 'localhost',
    dialect: 'mysql'
});


db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error: string) => {
        console.error('Unable to connect to the database:', error);
    });


// CREATED USERS TABLE
const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    googleId: DataTypes.STRING,
    id_currentTour: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Tours',
            key: 'id',
            allowNull: false
        }
    }
}, { timestamps: true });

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
    description: DataTypes.TEXT,
    isOrdered: DataTypes.BOOLEAN,
    neighborhood: DataTypes.STRING,
    completions: DataTypes.INTEGER,
    totalWaypoints: DataTypes.INTEGER,
    startLong: DataTypes.DECIMAL(7,5),
    startLat: DataTypes.DECIMAL(7,5)
}, { timestamps: true });


// CREATED WAYPOINTS TABLE
const Waypoint = db.define('Waypoint', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    waypointName: DataTypes.STRING,
    description: DataTypes.TEXT,
    prompt: DataTypes.TEXT,
    answer: DataTypes.STRING,
    long: DataTypes.DECIMAL(7,5),
    lat: DataTypes.DECIMAL(7,5),
    ratingAvg: DataTypes.DECIMAL
}, { timestamps: true });

// CREATED CATEGORIES TABLE
const Category = db.define('Category', { //waypoint description
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: DataTypes.STRING,
    icon: DataTypes.STRING
});

// CREATED IMAGES TABLE
const Image = db.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
}, { timestamps: true });

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
}, { timestamps: true });

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
}, { timestamps: true });

const Users_Waypoints = db.define('Users_Waypoints', {
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_waypoint: {
        type: DataTypes.INTEGER,
        references: {
            model: Waypoint,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    status: DataTypes.STRING
  }, { timestamps: true });

const Images_Waypoints = db.define('Images_Waypoints', {
    id_waypoint: {
        type: DataTypes.INTEGER,
        references: {
            model: Waypoint,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_image: {
        type: DataTypes.INTEGER,
        references: {
            model: Image,
            key: 'id',
            allowNull: false,
        },
        onDelete: 'CASCADE'
    },
  }, { timestamps: true });


const Waypoints_Categories = db.define('Waypoints_Categories', {
    id_waypoint: {
        type: DataTypes.INTEGER,
        references: {
            model: Waypoint,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_category: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
});


const Tours_Waypoints = db.define('Tours_Waypoints', {
    id_tour: {
        type: DataTypes.INTEGER,
        references: {
            model: Tour,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_waypoint: {
        type: DataTypes.INTEGER,
        references: {
            model: Waypoint,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    order: DataTypes.INTEGER
  });

const Completed_Tours = db.define('Completed_Tours', {
    id_tour: {
        type: DataTypes.INTEGER,
        references: {
            model: Tour,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
  }, { timestamps: true });


const Images_Reviews = db.define('Images_Reviews', {
    id_review: {
        type: DataTypes.INTEGER,
        references: {
            model: Review,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_image: {
        type: DataTypes.INTEGER,
        references: {
            model: Image,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
  });

const Images_Tours  = db.define('Images_Tours', {
    id_tour: {
        type: DataTypes.INTEGER,
        references: {
            model: Tour,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_image: {
        type: DataTypes.INTEGER,
        references: {
            model: Image,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
  });


const Reviews_Tours = db.define('Reviews_Tours', {
    id_review: {
        type: DataTypes.INTEGER,
        references: {
            model: Review,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_tour: {
        type: DataTypes.INTEGER,
        references: {
            model: Tour,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
  });

const Reviews_Waypoints = db.define('Reviews_Waypoints', {
    id_review: {
        type: DataTypes.INTEGER,
        references: {
            model: Review,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_waypoint: {
        type: DataTypes.INTEGER,
        references: {
            model: Waypoint,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
  });


const Chats_Tours = db.define('Chats_Tours', {
    id_chat: {
        type: DataTypes.INTEGER,
        references: {
            model: Chat,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
    id_tour: {
        type: DataTypes.INTEGER,
        references: {
            model: Tour,
            key: 'id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    },
  });

db.options.logging = false;
db.sync();
db.options.logging = console.log;
// db.options.logging = (...msg: any) => console.log(msg);

export {
    db,
    Tour,
    User,
    Waypoint,
    Category,
    Image,
    Review,
    Chat,
    Users_Waypoints,
    Images_Waypoints,
    Waypoints_Categories,
    Tours_Waypoints,
    Completed_Tours,
    Images_Reviews,
    Images_Tours,
    Reviews_Tours,
    Reviews_Waypoints,
    Chats_Tours
};