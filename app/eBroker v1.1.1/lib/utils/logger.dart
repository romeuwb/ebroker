import 'dart:developer';

import 'package:flutter/foundation.dart';

/// For development only
/// visibleForTesting
class Logger {
  // static log(dynamic error, {String? name = "LOG"}) {
  //   if (kDebugMode) {
  //     print("\u001b[31m $error" " :$name:");
  //   }
  // }

  static error(dynamic error, {String? name = "LOG"}) {
    if (kDebugMode) {
      log("\u001b[46m\x1B[30m $error \x1B[0m\u001b[41m",
          name: name ?? "Importants");

      // print("\u001b[31m $error" " :$name:");
    }
  }

  static impornant(dynamic value, {String? name}) {
    log("\u001b[46m\x1B[30m $value \x1B[0m\u001b[41m",
        name: name ?? "Importants");
  }

  static throwTestError() {
    throw "Test Exeption";
  }
}

/***
Black: \u001b[30m
Red: \u001b[31m
Green: \u001b[32m
Yellow: \u001b[33m
Blue: \u001b[34m
Magenta: \u001b[35m
Cyan: \u001b[36m
White: \u001b[37m
Reset: \u001b[0m
Bright Black: \u001b[30;1m
Bright Red: \u001b[31;1m
Bright Green: \u001b[32;1m
Bright Yellow: \u001b[33;1m
Bright Blue: \u001b[34;1m
Bright Magenta: \u001b[35;1m
Bright Cyan: \u001b[36;1m
Bright White: \u001b[37;1m
Reset: \u001b[0m
*/

// enum Logger {
//   Black("30"),
//   Red("31"),
//   Green("32"),
//   Yellow("33"),
//   Blue("34"),
//   Magenta("35"),
//   Cyan("36"),
//   White("37");

//   final String code;
//   const Logger(this.code);

//   void log(dynamic text) {
//     if (kDebugMode) {
//       print('\x1B[${code}m$text\x1B[0m');
//     }
//   }
// }

class Log {
  void printLongString(String text) {
    final RegExp pattern = RegExp('.{1,800}'); // 800 is the size of each chunk
    pattern
        .allMatches(text)
        .forEach((RegExpMatch match) => print(match.group(0)));
  }
}
