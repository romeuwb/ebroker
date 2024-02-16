import 'dart:developer';

import 'package:ebroker/Ui/screens/widgets/Erros/something_went_wrong.dart';
import 'package:ebroker/exports/main_export.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:path_provider/path_provider.dart';

import '../data/Repositories/personalized_feed_repository.dart';
import '../data/Repositories/system_repository.dart';
import '../data/cubits/Personalized/fetch_personalized_properties.dart';
import '../data/model/Personalized/personalized_settings.dart';
import '../data/model/app_settings_datamodel.dart';
import '../data/model/system_settings_model.dart';
import '../firebase_options.dart';
import '../main.dart';
import '../utils/api.dart';
import '../utils/guestChecker.dart';
import '../utils/hive_keys.dart';
import 'default_app_setting.dart';

PersonalizedInterestSettings personalizedInterestSettings =
    PersonalizedInterestSettings.empty();
AppSettingsDataModel appSettings = fallbackSettingAppSettings;
void initApp() async {
  ///Note: this file's code is very necessary and sensitive if you change it, this might affect whole app , So change it carefully.
  ///This must be used do not remove this line
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.initialize();
  await Hive.initFlutter();
  await Hive.openBox(HiveKeys.userDetailsBox);
  await Hive.openBox(HiveKeys.authBox);
  await Hive.openBox(HiveKeys.languageBox);
  await Hive.openBox(HiveKeys.themeBox);
  await Hive.openBox(HiveKeys.svgBox);
  await Hive.openBox(HiveKeys.themeColorBox);
  try {
    await LoadAppSettings().load();
  } catch (e) {
    print("no interent $e");
  }

  Api.initInterceptors();

  ///This is the widget to show uncaught runtime error in this custom widget so that user can know in that screen something is wrong instead of grey screen
  if (kReleaseMode) {
    ErrorWidget.builder =
        (FlutterErrorDetails flutterErrorDetails) => SomethingWentWrong(
              error: flutterErrorDetails,
            );
  }

  if (Firebase.apps.isNotEmpty) {
    await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform);
  } else {
    await Firebase.initializeApp();
  }

  FirebaseMessaging.onBackgroundMessage(
      NotificationService.onBackgroundMessageHandler);
  HydratedBloc.storage = await HydratedStorage.build(
    storageDirectory: await getApplicationDocumentsDirectory(),
  );

  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]).then(
    (_) async {
      SystemChrome.setSystemUIOverlayStyle(
          const SystemUiOverlayStyle(statusBarColor: Colors.transparent));

      runApp(const EntryPoint());
    },
  );
}

Future getDefaultLanguage(VoidCallback onSuccess) async {
  try {
    if (HiveUtils.getLanguage() == null ||
        HiveUtils.getLanguage()?['data'] == null) {
      Map result = await SystemRepository().fetchSystemSettings(
        isAnonymouse: true,
      );

      var code = (result['data']['default_language']);

      await Api.get(
        url: Api.getLanguagae,
        queryParameters: {
          Api.languageCode: code,
        },
        useAuthToken: false,
      ).then((value) {
        HiveUtils.storeLanguage({
          "code": value['data']['code'],
          "data": value['data']['file_name'],
          "name": value['data']['name']
        });
        onSuccess.call();
      });
    } else {
      onSuccess.call();
    }
  } catch (e) {
    log("Error while load default language $e");
  }
}

bool checkPersistedDataAvailibility() {
  int dataAvailibile = 0;
  for (Type cubit in Constant.hydratedCubits) {
    if (HydratedBloc.storage.read('$cubit') == null) {
    } else {
      dataAvailibile++;
    }
  }
  if (dataAvailibile == Constant.hydratedCubits.length) {
    return true;
  } else {
    return false;
  }
}

void loadInitialData(BuildContext context,
    {bool? loadWithoutDelay, bool? forceRefresh}) {
  context.read<SliderCubit>().fetchSlider(context,
      loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context.read<FetchCategoryCubit>().fetchCategories(
      loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context
      .read<FetchMostViewedPropertiesCubit>()
      .fetch(loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context
      .read<FetchPromotedPropertiesCubit>()
      .fetch(loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);

  context
      .read<FetchMostLikedPropertiesCubit>()
      .fetch(loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context
      .read<FetchNearbyPropertiesCubit>()
      .fetch(loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context.read<FetchCityCategoryCubit>().fetchCityCategory(
      loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context
      .read<FetchRecentPropertiesCubit>()
      .fetch(loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context
      .read<FetchPersonalizedPropertyList>()
      .fetch(loadWithoutDelay: loadWithoutDelay, forceRefresh: forceRefresh);
  context.read<GetChatListCubit>().setContext(context);
  context.read<GetChatListCubit>().fetch();

  // if (widget.from != "login") {
  PersonalizedFeedRepository().getUserPersonalizedSettings().then((value) {
    personalizedInterestSettings = value;
  });
  GuestChecker.listen().addListener(() {
    if (GuestChecker.value == false) {
      PersonalizedFeedRepository().getUserPersonalizedSettings().then((value) {
        personalizedInterestSettings = value;
      });
    }
  });

//    // }

  var setting = context
      .read<FetchSystemSettingsCubit>()
      .getSetting(SystemSetting.subscription);

  ///This will fetch settings if it is not available
  if (setting == null) {
    context.read<FetchSystemSettingsCubit>().fetchSettings(isAnonymouse: false);
  }
  if (setting != null) {
    //This will set package id if subscription is available
    if (setting.length != 0) {
      String packageId = setting[0]['package_id'].toString();
      Constant.subscriptionPackageId = packageId;
    }
  }
}
