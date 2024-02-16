#!/bin/bash
echo "Welcome to WRTeam's product eBroker!"

#Please add these dependencies into pubspec.yaml if not there rename,flutter_launcher_icons
#this file will help change app name , package name, and change launcher icon.

{
    flutter pub get
    flutter pub global activate rename
} >/dev/null 2>&1

text_file="config.txt"

if [ ! -f "$text_file" ]; then
    echo "File $text_file not found."
    exit 1
fi

while IFS='=' read -r key value; do
    case "$key" in
        "APP_NAME")
            app_name="$value"
            ;;
          "APP_PACKAGE")
                      package_name="$value"
                      ;;
        # Add more cases for other key-value pairs if needed#
        # "APP_PACKAGE")
         #                      package_name="$value"
          #                   ;;
        #
    esac
done < "$text_file"

handle_error() {
    echo "Error: $1"
    exit 1
}

echo "Changing app name to ${app_name}"
rename setAppName --targets ios,android --value "${app_name}">/dev/null 2>&1 || handle_error "Failed to set app name"
echo "--App name changed!--"

echo "Changing package name to ${package_name}"
rename setBundleId --targets ios,android --value "${package_name}" >/dev/null 2>&1|| handle_error "Failed to set app package"
echo "--App package changed!--"

echo "Changing App Icons"
flutter pub run flutter_launcher_icons>/dev/null 2>&1
echo "--App Icon changed!--"


echo "Basic setup done!"
echo "Please follow documentation for more! https://wrteamdev.github.io/ebroker-App-Doc/"


