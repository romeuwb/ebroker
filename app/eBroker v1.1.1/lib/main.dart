import 'package:ebroker/data/cubits/Personalized/add_update_personalized_interest.dart';
import 'package:ebroker/data/cubits/Personalized/fetch_personalized_properties.dart';
import 'package:ebroker/data/cubits/property/fetch_city_property_list.dart';
import 'package:ebroker/utils/Encryption/rsa.dart';
import 'package:ebroker/utils/Network/apiCallTrigger.dart';
import 'package:ebroker/utils/ui_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'Ui/screens/ChatNew/MessageTypes/registerar.dart';
import 'exports/main_export.dart';

////////////////
///V-1.1.1////
////////////

void main() => initApp();

class EntryPoint extends StatefulWidget {
  const EntryPoint({
    Key? key,
  }) : super(key: key);
  @override
  EntryPointState createState() => EntryPointState();
}

class EntryPointState extends State<EntryPoint> {
  @override
  void initState() {
    super.initState();
    ChatMessageHandler.handle();
    ChatGlobals.init();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
        providers: [
          BlocProvider(create: (context) => AuthCubit()),
          BlocProvider(create: (context) => LoginCubit()),
          BlocProvider(create: (context) => SliderCubit()),
          BlocProvider(create: (context) => CompanyCubit()),
          BlocProvider(create: (context) => PropertyCubit()),
          BlocProvider(create: (context) => FetchCategoryCubit()),
          BlocProvider(create: (context) => HouseTypeCubit()),
          BlocProvider(create: (context) => SearchPropertyCubit()),
          BlocProvider(create: (context) => DeleteAccountCubit()),
          BlocProvider(create: (context) => TopViewedPropertyCubit()),
          BlocProvider(create: (context) => ProfileSettingCubit()),
          BlocProvider(create: (context) => NotificationCubit()),
          BlocProvider(create: (context) => AppThemeCubit()),
          BlocProvider(create: (context) => AuthenticationCubit()),
          BlocProvider(create: (context) => FetchHomePropertiesCubit()),
          BlocProvider(create: (context) => FetchTopRatedPropertiesCubit()),
          BlocProvider(create: (context) => FetchMyPropertiesCubit()),
          BlocProvider(create: (context) => FetchPropertyFromCategoryCubit()),
          BlocProvider(create: (context) => FetchNotificationsCubit()),
          BlocProvider(create: (context) => LanguageCubit()),
          BlocProvider(create: (context) => GooglePlaceAutocompleteCubit()),
          BlocProvider(create: (context) => FetchArticlesCubit()),
          BlocProvider(create: (context) => FetchSystemSettingsCubit()),
          BlocProvider(create: (context) => FavoriteIDsCubit()),
          BlocProvider(create: (context) => FetchPromotedPropertiesCubit()),
          BlocProvider(create: (context) => FetchMostViewedPropertiesCubit()),
          BlocProvider(create: (context) => FetchFavoritesCubit()),
          BlocProvider(create: (context) => CreatePropertyCubit()),
          BlocProvider(create: (context) => UserDetailsCubit()),
          BlocProvider(create: (context) => FetchLanguageCubit()),
          BlocProvider(create: (context) => LikedPropertiesCubit()),
          BlocProvider(create: (context) => EnquiryIdsLocalCubit()),
          BlocProvider(create: (context) => AddToFavoriteCubitCubit()),
          BlocProvider(create: (context) => FetchSubscriptionPackagesCubit()),
          BlocProvider(create: (context) => RemoveFavoriteCubit()),
          BlocProvider(create: (context) => GetApiKeysCubit()),
          BlocProvider(create: (context) => FetchCityCategoryCubit()),
          BlocProvider(create: (context) => SetPropertyViewCubit()),
          BlocProvider(create: (context) => GetChatListCubit()),
          BlocProvider(
              create: (context) => FetchPropertyReportReasonsListCubit()),
          BlocProvider(create: (context) => FetchMostLikedPropertiesCubit()),
          BlocProvider(create: (context) => FetchNearbyPropertiesCubit()),
          BlocProvider(create: (context) => FetchOutdoorFacilityListCubit()),
          BlocProvider(create: (context) => FetchRecentPropertiesCubit()),
          BlocProvider(create: (context) => PropertyEditCubit()),
          BlocProvider(create: (context) => FetchCityPropertyList()),
          BlocProvider(create: (context) => FetchPersonalizedPropertyList()),
          BlocProvider(create: (context) => AddUpdatePersonalizedInterest()),
          BlocProvider(create: (context) => GetSubsctiptionPackageLimitsCubit())
        ],
        child: Builder(builder: (BuildContext context) {
          return const App();
        }));
  }
}

class App extends StatefulWidget {
  const App({super.key});
  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  void initState() {
    ///Here Fetching property report reasons
    context.read<FetchPropertyReportReasonsListCubit>().fetch();
    context.read<LanguageCubit>().loadCurrentLanguage();
    AppTheme currentTheme = HiveUtils.getCurrentTheme();

    ///Initialized notification services
    LocalAwsomeNotification().init(context);
    ///////////////////////////////////////
    NotificationService.init(context);

    /// Initialized dynamic links for share properties feature
    context.read<AppThemeCubit>().changeTheme(currentTheme);

    APICallTrigger.onTrigger(
      () {
        //THIS WILL be CALLED WHEN USER WILL LOGIN FROM ANONYMOUS USER.
        context.read<LikedPropertiesCubit>().emit(LikedPropertiesState(
              liked: {},
              removedLikes: {},
            ));
        context.read<GetApiKeysCubit>().fetch();

        loadInitialData(context, loadWithoutDelay: true);
      },
    );

    UiUtils.setContext(context);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    //Continuously watching theme change
    AppTheme currentTheme = context.watch<AppThemeCubit>().state.appTheme;
    // currentTheme = AppTheme.dark;
    return BlocListener<FetchLanguageCubit, FetchLanguageState>(
      listener: (context, state) {},
      child: BlocListener<GetApiKeysCubit, GetApiKeysState>(
        listener: (context, state) {
          if (state is GetApiKeysSuccess) {
            /// Assigning Api keys from here :)
            AppSettings.paystackKey = state.paystackPublicKey;
            AppSettings.razorpayKey = state.razorPayKey;
            AppSettings.enabledPaymentGatway = state.enabledPaymentGatway;
            AppSettings.paystackCurrency = state.paystackCurrency;
            AppSettings.stripeCurrency = state.stripeCurrency;
            AppSettings.stripePublishableKey = state.stripePublishableKey;
            AppSettings.stripeSecrateKey = RSAEncryption().decrypt(
              privateKey: Constant.keysDecryptionPasswordRSA,
              encryptedData: state.stripeSecretKey,
            );
            paystack.init(AppSettings.paystackKey);
          }
        },
        child: BlocBuilder<LanguageCubit, LanguageState>(
          builder: (context, languageState) {
            return MaterialApp(
              initialRoute: Routes
                  .splash, // App will start from here splash screen is first screen,
              navigatorKey: Constant
                  .navigatorKey, //This navigator key is used for Navigate users through notification
              title: Constant.appName,
              debugShowCheckedModeBanner: false,
              onGenerateRoute: Routes.onGenerateRouted,
              theme: appThemeData[currentTheme],
              builder: (context, child) {
                TextDirection direction;
                //here we are languages direction locally
                if (languageState is LanguageLoader) {
                  if (Constant.totalRtlLanguages
                      .contains((languageState).languageCode)) {
                    direction = TextDirection.rtl;
                  } else {
                    direction = TextDirection.ltr;
                  }
                } else {
                  direction = TextDirection.ltr;
                }
                return MediaQuery(
                  data: MediaQuery.of(context).copyWith(
                    textScaler: const TextScaler.linear(1.0),
                    // textScaleFactor:
                    //     1.0, //set text scale factor to 1 so that this will not resize app's text while user change their system settings text scale
                  ),
                  child: Directionality(
                    textDirection:
                        direction, //This will convert app direction according to language
                    child: child!,
                  ),
                );
              },
              localizationsDelegates: const [
                AppLocalization.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              locale: loadLocalLanguageIfFail(languageState),
            );
          },
        ),
      ),
    );
  }

  dynamic loadLocalLanguageIfFail(LanguageState state) {
    if ((state is LanguageLoader)) {
      return Locale(state.languageCode);
    } else if (state is LanguageLoadFail) {
      return const Locale("en");
    }
  }
}

Future<void> handleDeepLink(String link) async {
  print('Received deep link: $link');
  // Implement logic to navigate to the appropriate screen based on the deep link
}

// Set up the platform channel
const MethodChannel platform = MethodChannel('your_channel_name');
channel() {
  platform.setMethodCallHandler((call) async {
    if (call.method == 'handleDeepLink') {
      String link = call.arguments;
      await handleDeepLink(link);
    }
  });
}
