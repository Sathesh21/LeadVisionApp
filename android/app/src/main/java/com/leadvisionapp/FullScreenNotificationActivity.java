package com.leadvisionapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

public class FullScreenNotificationActivity extends Activity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Make it full screen
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        
        setContentView(R.layout.activity_fullscreen_notification);
        
        // Get notification data
        Intent intent = getIntent();
        String leadName = intent.getStringExtra("leadName");
        String leadLocation = intent.getStringExtra("leadLocation");
        String matchScore = intent.getStringExtra("matchScore");
        
        // Set up UI
        TextView titleText = findViewById(R.id.notification_title);
        TextView nameText = findViewById(R.id.lead_name);
        TextView locationText = findViewById(R.id.lead_location);
        TextView scoreText = findViewById(R.id.match_score);
        Button acceptButton = findViewById(R.id.accept_button);
        Button rejectButton = findViewById(R.id.reject_button);
        
        titleText.setText("🔔 New Lead Alert!");
        nameText.setText(leadName);
        locationText.setText("📍 " + leadLocation);
        scoreText.setText("Match Score: " + matchScore + "%");
        
        acceptButton.setOnClickListener(v -> {
            // Handle accept
            Intent resultIntent = new Intent();
            resultIntent.putExtra("action", "accept");
            setResult(RESULT_OK, resultIntent);
            finish();
        });
        
        rejectButton.setOnClickListener(v -> {
            // Handle reject
            Intent resultIntent = new Intent();
            resultIntent.putExtra("action", "reject");
            setResult(RESULT_OK, resultIntent);
            finish();
        });
    }
}