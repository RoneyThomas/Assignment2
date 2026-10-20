const getUniqueErrorMessage = (err) => {
  let output
  try {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    output = field.charAt(0).toUpperCase() + field.slice(1) + ' already exists'
  } catch (ex) {
    output = 'Unique field already exists'
  }
  return output
}

const getErrorMessage = (err) => {
  let message = ''
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err)
        break
      default:
        message = 'Something went wrong'
    }
  } else if (err.errors) {
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message
    }
  } else if (err.message) {
    message = err.message
  }
  return message
}

export default { getErrorMessage }
