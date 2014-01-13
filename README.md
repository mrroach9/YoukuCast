Youku Cast
=========

Youku Cast is a Chrome extension based on Google Cast, launching your online videos from popular video websites (currently Youku only) to your Chromecast fast and easily.

Due to the lack of an official Chromecast SDK on Chrome platform and the development progress issue, Youku Cast is currently for alpha testing only.

###Installation

####Requirements

* An initialized Chromecast device connected to Internet.
* Wireless network that connects both your laptop (or desktop) and your Chromecast.
* Chrome 30+
* Google Cast extension installed on your Chrome.

####Whitelisting

To enable your Chromecast to interact with Youku Cast, you need to whitelist both your Chromecast and Youku Cast.

* To enable Youku Cast:
  * Open Chrome extension page (chrome://extensions), and check the Developer mode checkbox to enable developer mode.
  * Open Google Cast option page, click 4-7 times on the blue Cast icon in the page's upper left corner. The Developer Settings will appear.
  * In the Cast SDK additional domains field, enter:
```
  [http://lab.roach-works.com]
```

* To enable your Chromecast:
  * Find the device serial number of your Chromecast on the markings on the back side. The serial number is the topmost number that begins with a 3, 4 or 5. 
  * Send an email to me (you know who :-)) with your name and serial number. I will add you to the whitelist of the app. As it requires approval from Google, it may take up to 1 week to confirm.
  * Run your Chromecast native setting app (for Win or for Mac). Under **Privacy**, check the box to **Send this Chromecast's serial number when checking for updates.** Then reboot your Chromecast.

Check more details at:
```
[https://developers.google.com/cast/whitelisting#whitelist-chrome]
```

Then you can install Youku Cast from Chrome Store at
```
[TODO] Add web address here for Youku Cast.
```

### How to use

Due to the limitation of Google Cast API, there needs to be an app page running in a Chrome tab during the usage to Youku Cast. Please do not close it as it will cause disconnection of Youku Cast and your Chromecast (and Youku Cast will try to re-open it).

At any time, click on Youku Cast icon, all Youku video players in all opened pages will be detected and listed in the popup page, select the one that you want to cast and click it to start casting.

The bottom part of the popup page shows the current status and controller of your Chromecast. Youku API currently allows playing/pausing/stopping and seeking to a specified time. No volume adjusting is permitted at this time. To switch between multiple Chromecasts, click on the link above the controller on the right. 

### Troubleshooting

* If the status bar above the controller shows "API not initialized", click on "start" link on its right to open the background page. If it does not resolve the issue, check whether you and your Chromecast are in the same LAN and have full access to Internet.

* If the status bar shows "No device found" but you do have an Chromecast device, please check whether it is whitelisted and connected to the same WAN as your laptop. It usually takes a few seconds for the device list to refresh. 

* If any of your Youku video player embedded in some page does not show up in the popup page, try to refresh that page as the content script might have crashed. If that does not resolve the issue, please contact me.

