const map = require("lodash/map");

//esta função faz uma limpeza no banco de dados, usado para teste com beforeEach()
module.exports = async function truncate(models) {
  return await Promise.all(
    map(Object.keys(models), (key) => {
      if (["sequelize", "Sequelize"].includes(key)) return null;
      return models[key].destroy({ where: {}, force: true });
    })
  );
};