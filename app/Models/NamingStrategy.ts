import { string } from '@ioc:Adonis/Core/Helpers';
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm';

export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public tableName(model: typeof BaseModel) {
    return string.pluralize(string.camelCase(model.name));
  }

  public columnName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName);
  }

  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName);
  }

  public relationLocalKey(
    relation: string,
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    if (relation === 'belongsTo') {
      return relatedModel.primaryKey;
    }

    return model.primaryKey;
  }

  public relationForeignKey(
    relation: string,
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    if (relation === 'belongsTo') {
      return string.camelCase(`${relatedModel.name}_${relatedModel.primaryKey}`);
    }

    return string.camelCase(`${model.name}_${model.primaryKey}`);
  }

  public relationPivotTable(
    _relation: 'manyToMany',
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    return string.camelCase([relatedModel.name, model.name].sort().join('_'));
  }

  public relationPivotForeignKey(_relation: 'manyToMany', model: typeof BaseModel) {
    return string.camelCase(`${model.name}_${model.primaryKey}`);
  }

  public paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'perPage',
      lastPage: 'lastPage',
      firstPage: 'firstPage',
      currentPage: 'currentPage',
      lastPageUrl: 'lastPageUrl',
      nextPageUrl: 'nextPageUrl',
      firstPageUrl: 'firstPageUrl',
      previousPageUrl: 'previousPageUrl',
    };
  }
}
