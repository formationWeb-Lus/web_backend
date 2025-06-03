const { getClassifications } = require('../models/classificationModel');

async function getNav() {
  try {
    const classifications = await getClassifications(); // appel à ta fonction SQL
    return classifications.map(c => ({
      name: c.classification_name,
      href: `/classification/${c.classification_id}`,
    }));
  } catch (err) {
    console.error("Erreur navigation:", err);
    return [];
  }
}

module.exports = getNav;
