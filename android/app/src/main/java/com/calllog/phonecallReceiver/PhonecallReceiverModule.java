package com.phonecallReceiver;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Map;

import java.sql.Date;

import android.app.Activity;
import android.app.LoaderManager;
import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.os.Bundle;
import android.provider.CallLog;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import android.support.v4.content.LocalBroadcastManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.widget.Toast;
import android.telephony.TelephonyManager;


public class PhonecallReceiverModule extends ReactContextBaseJavaModule {

	private ReactContext mReactContext;

	public PhonecallReceiverModule(ReactApplicationContext reactContext) {
			super(reactContext);
			this.mReactContext = reactContext;

	}

		public void sendEvent(String eventName, WritableMap params) {
				Log.d("PhonecallReceiver", " has received!");
				Log.d("EventName", eventName);
				
				
				/*reactContext
					.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
					.emit(eventName, params);*/
		}


	@Override
	public String getName() {
		return "PhonecallReceiver";
	}

	@ReactMethod
	public void testCall(Callback callback) {
		try{
			callback.invoke("yo");
		}catch(Exception e){  

		}
	}

}