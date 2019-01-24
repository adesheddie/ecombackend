
module.exports = function(sequelize, Sequelize) {
 
    var Meeting_invition = sequelize.define('meeting_invition', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        invite_by:{
             type: Sequelize.INTEGER
         }, 
         magic_code:{
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        }
    });
    return Meeting_invition;
}