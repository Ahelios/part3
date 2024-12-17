const mongoose = require('mongoose')

// mongoose.set('strictQuery', false)

// const url = process.env.MONGODB_URI

// console.log('connecting to', url)

// mongoose.connect(url)
//   .then(() => {
//     console.log('connected to MongoDB')
//   })
//   .catch((error) => {
//     console.log('error connecting to MongoDB:', error.message)
//   })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3, 
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        if(v.length < 8) {
          return false;
        } 
        
        if((v.includes('-'))) {
          let vPartsArray = v.split('-');

          if((vPartsArray.length === 2) && 
          (vPartsArray[0].length > 1) &&
          (vPartsArray[0].length <= 3))  {
            return vPartsArray.every(part => !isNaN(Number(part)));
          }
        }

        return false;
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)