package com.callLogListModule;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import java.util.Map;

import java.sql.Date;

public class CallLogListModule extends ReactContextBaseJavaModule {

  public CallLogListModule(ReactApplicationContext reactContext) {
	super(reactContext);
  }

   @Override
   public String getName() {
	 return "CallLogList";
   }

   @ReactMethod
	public void testCall(Callback callback) {
		try{



			callback.invoke("yo");
		}catch(Exception e){  

		}
	}

}