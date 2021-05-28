const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
    type:"string",
    base:joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags:[],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error("string.escapeHTML", {value})
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.farmSchema = Joi.object({
    farm: Joi.object({
        name: Joi.string().required().escapeHTML(), 
        location: Joi.string().required().escapeHTML(),
        about: Joi.string().required().escapeHTML(),
        contact: Joi.string().required().escapeHTML()
    }).required(),
    deletePhotos:Joi.array()
})


module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required().escapeHTML(),
        price: Joi.number().min(0).required(), 
        unit: Joi.string().required(),
        category: Joi.string().required(),
        about: Joi.string().required().escapeHTML(),
    }).required(),
    deletePhotos:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required().escapeHTML(),        
    }).required()
})
