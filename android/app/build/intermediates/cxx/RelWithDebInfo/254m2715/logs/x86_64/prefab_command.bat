@echo off
"C:\\Program Files\\Java\\jdk-17\\bin\\java" ^
  --class-path ^
  "C:\\Users\\Acer 2\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  x86_64 ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  27 ^
  --output ^
  "C:\\Users\\ACER2~1\\AppData\\Local\\Temp\\agp-prefab-staging15742020890803878741\\staged-cli-output" ^
  "C:\\Users\\Acer 2\\.gradle\\caches\\8.13\\transforms\\48de17ae001fd5f1bcfd4007338aaa12\\transformed\\react-android-0.79.2-release\\prefab" ^
  "C:\\Users\\Acer 2\\.gradle\\caches\\8.13\\transforms\\532fdff9465dd631d517bd26502bc504\\transformed\\hermes-android-0.79.2-release\\prefab" ^
  "C:\\Users\\Acer 2\\.gradle\\caches\\8.13\\transforms\\72cde7dc85b5006383f56c98fcfedfa5\\transformed\\fbjni-0.7.0\\prefab"
