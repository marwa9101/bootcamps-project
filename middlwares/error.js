const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err}; // copie l'objet err pour changer le message et statusCode
    error.message = err.message; // si je n'ai pas customisé le message de l'objet error prend le message de err (original object)
    
    // Log to console for Dev porposes
    console.log(err.stack.red)

    // Mongoose bad objectId
    // response when we have an err specific (want to customize it with codeStauts and message)
    if (err.name ==='CastError') {
        const message = `Resource not found with id: ${err.value}`; // req.params.id == err.value
        error = new ErrorResponse(message, 404); // customize the error message and code status
    }
    
    // ... je peux ajouter et customiser n'importe quel type d'erreur en ajoutant le if et le nom de l'erreur comme les lignes (10,11,12,13)

    // pour tout d'autre types d'erreurs qui ne sont pas customisés
    // response when we have an err not specific (don't want to customize it in my app)
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error' // le message original (n'est pas customisé)
    });
};
module.exports = errorHandler;