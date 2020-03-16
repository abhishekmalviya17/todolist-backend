const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = (data) => {

    const schema = Joi.object(
        {
        firstname: Joi.string().min(6).required(),
        lastname: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
        }
    );    
    return schema.validate(data);
}

const loginValidation = (data) => {

    const schema = Joi.object(
        {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
        }
    );    
    return schema.validate(data);
}

const eventsValidation = (data) => {

    const schema = Joi.object(
        {
        title: Joi.string().min(6).required(),
        description: Joi.string().min(6).required(),
        isDone: Joi.boolean().required()
        }
    );    
    return schema.validate(data);
}



module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.eventsValidation = eventsValidation;