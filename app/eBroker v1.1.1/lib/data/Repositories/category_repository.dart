import '../../utils/api.dart';
import '../../utils/constant.dart';
import '../model/category.dart';
import '../model/data_output.dart';

class CategoryRepository {
  Future<DataOutput<Category>> fetchCategories({
    required int offset,
  }) async {
    Map<String, dynamic> parameters = {
      Api.offset: offset,
      Api.limit: Constant.loadLimit,
    };
    Map<String, dynamic> response =
        await Api.get(url: Api.apiGetCategories, queryParameters: parameters);

    List<Category> modelList = (response['data'] as List).map(
      (e) {
        return Category.fromJson(e);
      },
    ).toList();
    return DataOutput(total: response['total'] ?? 0, modelList: modelList);
  }
}
