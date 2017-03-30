package com.phonecallReceiver;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
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

public class PhonecallReceiverModule extends ReactContextBaseJavaModule {

  public PhonecallReceiverModule(ReactApplicationContext reactContext) {
	super(reactContext);
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