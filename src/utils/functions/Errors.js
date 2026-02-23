const { colors } = require('../bases');

const Errors = (err, menu) => new Promise(async(res, rej) => {
  menu = menu.replace(process.cwd(), '').replace('\\src', '').replaceAll('\\', '/');

  if (err.error) {
    return rej({ error: err.error });
  } 

  // MONGODB - DATABASE
  else if (err.code === 11000) {
    if (err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return rej({ error: `O campo '${field}' com o valor '${value}' já existe no nosso sistema...` });
    }
    return rej({ error: 'Os dados passados já existem em nosso sistema...' });
  } else if (typeof err.errors === 'object' && !Array.isArray(err.errors)) {
    const field = err.errors[Object.keys(err.errors)[0]];
    if (field.kind === 'required') {
      return rej ({ error: `O campo '${field.path}' não pode ficar vazio...` });
    } else if (field.kind === 'ObjectId') {
      return rej ({ error: `O campo '${field.path}' precisa ser um ID valido...` });
    }
    return rej ({ error: `Ocorreu algum erro ao salvar esse registro no banco de dados...\n${ JSON.stringify(err.errors) }` });
  } else if (err.kind === 'ObjectId') {
    return rej ({ error: `O id '${err.value}' não é um ID valido...` });
  }
  
  else {
    console.log(err);
    console.log(`${colors.RED}[${menu} ERROR]=> ${colors.RESET}`);
    return rej({ error: 'Ocorreu algum ERRO inesperado em meu sistema! Reporte ao meu desenvolvedor...' });
  }
});

module.exports = Errors;