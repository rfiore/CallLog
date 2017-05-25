package com.calllog;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;


import android.widget.Toast;

import java.util.Date;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.util.Log;

import com.phonecallReceiver.PhonecallReceiverModule;

public class BroadcastReceiverCustom extends BroadcastReceiver {
	
	private static int lastState = TelephonyManager.CALL_STATE_IDLE;
	private static Date callStartTime;
	private static boolean isIncoming;
	private static String savedNumber;  //because the passed incoming is only valid in ringing

	ReactApplicationContext reactContext;

	PhonecallReceiverModule phonecallReceiverModule;

	public BroadcastReceiverCustom(){
		phonecallReceiverModule = new PhonecallReceiverModule(reactContext);
	}

	@Override
	public void onReceive(Context context, Intent intent) {

		WritableMap params = Arguments.createMap();
    params.putString("testParam", "yo");

		phonecallReceiverModule.sendEvent("notificationReceived", params);

		//We listen to two intents.  The new outgoing call only tells us of an outgoing call.  We use it to get the number.
		if (intent.getAction().equals("android.intent.action.NEW_OUTGOING_CALL")) {
			savedNumber = intent.getExtras().getString("android.intent.extra.PHONE_NUMBER");
		}
		else{
			String stateStr = intent.getExtras().getString(TelephonyManager.EXTRA_STATE);
			String number = intent.getExtras().getString(TelephonyManager.EXTRA_INCOMING_NUMBER);
			int state = 0;
			if(stateStr.equals(TelephonyManager.EXTRA_STATE_IDLE)){
				state = TelephonyManager.CALL_STATE_IDLE;
			}
			else if(stateStr.equals(TelephonyManager.EXTRA_STATE_OFFHOOK)){
				state = TelephonyManager.CALL_STATE_OFFHOOK;
			}
			else if(stateStr.equals(TelephonyManager.EXTRA_STATE_RINGING)){
				state = TelephonyManager.CALL_STATE_RINGING;
			}


			onCallStateChanged(context, state, number);
		}
	}

	//Derived classes should override these to respond to specific events of interest
	protected void onIncomingCallStarted(Context ctx, String number, Date start){
		Toast.makeText(ctx,"Incoming Call Started", Toast.LENGTH_LONG).show();
	}

	protected void onOutgoingCallStarted(Context ctx, String number, Date start){
		Toast.makeText(ctx,"Outgoing Call Started", Toast.LENGTH_LONG).show();
	}

	protected void onIncomingCallEnded(Context ctx, String number, Date start, Date end){
		Toast.makeText(ctx,"Incoming Call Ended", Toast.LENGTH_LONG).show();
	}

	protected void onOutgoingCallEnded(Context ctx, String number, Date start, Date end){
		Toast.makeText(ctx,"Out going CallEnded", Toast.LENGTH_LONG).show();
	}

	protected void onMissedCall(Context ctx, String number, Date start){
		Toast.makeText(ctx,"Missed Call", Toast.LENGTH_LONG).show();
	}

	//Deals with actual events

	//Incoming call-  goes from IDLE to RINGING when it rings, to OFFHOOK when it's answered, to IDLE when its hung up
	//Outgoing call-  goes from IDLE to OFFHOOK when it dials out, to IDLE when hung up
	public void onCallStateChanged(Context context, int state, String number) {
		if(lastState == state){
			//No change, debounce extras
			return;
		}
		switch (state) {
			case TelephonyManager.CALL_STATE_RINGING:
				isIncoming = true;
				callStartTime = new Date();
				savedNumber = number;
				onIncomingCallStarted(context, number, callStartTime);
				break;
			case TelephonyManager.CALL_STATE_OFFHOOK:
				//Transition of ringing->offhook are pickups of incoming calls.  Nothing done on them
				if(lastState != TelephonyManager.CALL_STATE_RINGING){
					isIncoming = false;
					callStartTime = new Date();
					onOutgoingCallStarted(context, savedNumber, callStartTime);                     
				}
				break;
			case TelephonyManager.CALL_STATE_IDLE:
				//Went to idle-  this is the end of a call.  What type depends on previous state(s)
				if(lastState == TelephonyManager.CALL_STATE_RINGING){
					//Ring but no pickup-  a miss
					onMissedCall(context, savedNumber, callStartTime);
				}
				else if(isIncoming){
					onIncomingCallEnded(context, savedNumber, callStartTime, new Date());                       
				}
				else{
					onOutgoingCallEnded(context, savedNumber, callStartTime, new Date());                                               
				}
				break;
		}
		lastState = state;
	}
}