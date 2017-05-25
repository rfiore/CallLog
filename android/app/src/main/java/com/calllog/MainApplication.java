package com.calllog;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.chirag.RNMail.*;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.nerdyfactory.notification.NotificationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.calendarevents.CalendarEventsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;



public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNMail(),
          new ReactNativeContacts(),
          new ReactNativePushNotificationPackage(),
          new NotificationPackage(),
          new RNFetchBlobPackage() ,
          new CalendarEventsPackage(),
          new BackgroundTimerPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
