plugins {
    id("com.android.application")
}

android {
    namespace = "com.codelantern.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.codelantern.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    // One fixed key for every build (local or GitHub), so new versions install
    // over old ones and your saved pens survive updates.
    signingConfigs {
        create("pocketpen") {
            storeFile = rootProject.file("pocketpen.keystore")
            storePassword = "pocketpen"
            keyAlias = "pocketpen"
            keyPassword = "pocketpen"
        }
    }

    buildTypes {
        getByName("debug") {
            signingConfig = signingConfigs.getByName("pocketpen")
        }
        getByName("release") {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("pocketpen")
        }
    }

    lint {
        abortOnError = false
        checkReleaseBuilds = false
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
