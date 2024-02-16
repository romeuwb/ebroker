import 'package:dio/dio.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';

class NetworkRequestInterseptor extends Interceptor {
  int totalAPICallTimes = 0;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    totalAPICallTimes++;
    ({
      "URL": options.path,
      "Parameters":
          options.method == "POST" ? options.data : options.queryParameters,
      "Method": options.method,
      "_total_api_calls": totalAPICallTimes
    }).log("Request-API");
    handler.next(options);
  }

  @override
  void onError(DioError err, ErrorInterceptorHandler handler) {
    ({
      "URL": err.response?.requestOptions.path ?? "",
      "Type": err.type,
      "Error": err.error,
      "Message": err.message,
    }).log("API-Error");

    handler.next(err);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    ({
      "URL": response.requestOptions?.path,
      "Method": response.requestOptions.method,
      "status": response.statusCode,
      "statusMessage": response.statusMessage,
      "response": response.data,
    }).log("Response-API");
    handler.next(response);
  }
}
