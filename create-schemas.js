const fs = require('fs');
const path = require('path');

const contentTypes = [
  {
    type: 'collection', name: 'service', collectionName: 'services',
    attributes: {
      title_ar: { type: 'string', required: true },
      title_en: { type: 'string', required: true },
      description_ar: { type: 'text' },
      description_en: { type: 'text' },
      icon: { type: 'string' },
      image: { type: 'media', allowedTypes: ['images'] },
      order: { type: 'integer', default: 0 }
    }
  },
  {
    type: 'collection', name: 'pillar', collectionName: 'pillars',
    attributes: {
      title_ar: { type: 'string', required: true },
      title_en: { type: 'string', required: true },
      description_ar: { type: 'text' },
      description_en: { type: 'text' },
      icon: { type: 'string' },
      order: { type: 'integer', default: 0 }
    }
  },
  {
    type: 'collection', name: 'gallery-item', collectionName: 'gallery-items',
    attributes: {
      title_ar: { type: 'string' },
      title_en: { type: 'string' },
      description_ar: { type: 'text' },
      description_en: { type: 'text' },
      image: { type: 'media', allowedTypes: ['images'] },
      order: { type: 'integer', default: 0 }
    }
  },
  {
    type: 'collection', name: 'statistic', collectionName: 'statistics',
    attributes: {
      number: { type: 'string' },
      label_ar: { type: 'string' },
      label_en: { type: 'string' },
      order: { type: 'integer', default: 0 }
    }
  },
  {
    type: 'collection', name: 'showcase-slide', collectionName: 'showcase-slides',
    attributes: {
      keyword_ar: { type: 'string' },
      keyword_en: { type: 'string' },
      image: { type: 'media', allowedTypes: ['images'] },
      order: { type: 'integer', default: 0 }
    }
  },
  {
    type: 'single', name: 'about', collectionName: 'about-info',
    attributes: {
      description_ar: { type: 'text' },
      description_en: { type: 'text' },
      feature1_label_ar: { type: 'string' },
      feature1_label_en: { type: 'string' },
      feature2_label_ar: { type: 'string' },
      feature2_label_en: { type: 'string' }
    }
  },
  {
    type: 'single', name: 'vision', collectionName: 'vision-info',
    attributes: {
      vision_ar: { type: 'text' },
      vision_en: { type: 'text' },
      mission_ar: { type: 'text' },
      mission_en: { type: 'text' },
      positioning_ar: { type: 'text' },
      positioning_en: { type: 'text' }
    }
  },
  {
    type: 'single', name: 'site-setting', collectionName: 'site-settings',
    attributes: {
      phone: { type: 'string' },
      email: { type: 'email' },
      address_ar: { type: 'text' },
      address_en: { type: 'text' },
      socials: { type: 'json' }
    }
  }
];

contentTypes.forEach(ct => {
  const isSingle = ct.type === 'single';
  const apiName = ct.name;
  const collectionName = ct.collectionName;
  
  const baseDir = path.join('src', 'api', apiName);
  const contentTypeDir = path.join(baseDir, 'content-types', apiName);
  const controllerDir = path.join(baseDir, 'controllers');
  const serviceDir = path.join(baseDir, 'services');
  
  fs.mkdirSync(contentTypeDir, { recursive: true });
  fs.mkdirSync(controllerDir, { recursive: true });
  fs.mkdirSync(serviceDir, { recursive: true });
  
  const schema = {
    kind: isSingle ? 'singleType' : 'collectionType',
    collectionName: collectionName,
    info: {
      singularName: apiName,
      pluralName: collectionName,
      displayName: apiName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    },
    options: {
      draftAndPublish: true
    },
    attributes: ct.attributes
  };
  
  fs.writeFileSync(
    path.join(contentTypeDir, 'schema.json'),
    JSON.stringify(schema, null, 2),
    'utf8'
  );
  
  const controllerContent = `const { createCoreController } = require('@strapi/strapi').factories;\nmodule.exports = createCoreController('api::${apiName}.${apiName}');\n`;
  fs.writeFileSync(path.join(controllerDir, `${apiName}.js`), controllerContent, 'utf8');
  
  const serviceContent = `const { createCoreService } = require('@strapi/strapi').factories;\nmodule.exports = createCoreService('api::${apiName}.${apiName}');\n`;
  fs.writeFileSync(path.join(serviceDir, `${apiName}.js`), serviceContent, 'utf8');
  
  console.log(`✓ Created ${isSingle ? 'single' : 'collection'} type: ${apiName} (collection: ${collectionName})`);
});

console.log('\n✅ All content types created successfully!');
console.log('Now restart Strapi with: npm run develop');