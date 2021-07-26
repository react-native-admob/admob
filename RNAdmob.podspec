require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNAdmob"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/react-native-admob/admob.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"

  # We can't add the Google-Mobile-Ads-SDK as a dependency, as it would prevent
  # this library to be used with `use_frameworks!`.
  # So instead we add the default location of the framework to the framework
  # search paths, and we rely on consumers of this library to add
  # Google-Mobile-Ads-SDK as a direct dependency.
  s.weak_frameworks        = 'GoogleMobileAds'
  s.pod_target_xcconfig    = {
    'FRAMEWORK_SEARCH_PATHS' => '"$(PODS_ROOT)/Google-Mobile-Ads-SDK/Frameworks/**"',
  }

  s.dependency "React-Core"
end
