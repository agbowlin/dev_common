"use strict";


var fs = require('fs');


module.exports = Utils_Casper;


function Utils_Casper(casper, logger, log_page_errors, log_remote_messages)
{
	casper.log_page_errors = log_page_errors; // || true;
	casper.log_remote_messages = log_remote_messages; // || true;


	//=====================================================================
	//=====================================================================
	//
	//  ╔═╗┌─┐┌─┐┌─┐┌─┐┬─┐  ╔═╗┬  ┬┌─┐┌┐┌┌┬┐┌─┐
	//  ║  ├─┤└─┐├─┘├┤ ├┬┘  ║╣ └┐┌┘├┤ │││ │ └─┐
	//  ╚═╝┴ ┴└─┘┴  └─┘┴└─  ╚═╝ └┘ └─┘┘└┘ ┴ └─┘
	//
	//=====================================================================
	//=====================================================================


	//=====================================================================
	casper.on("error", function(msg, trace)
	{
		logger.LogMessage("[Error] " + msg);
		logger.LogMessage("[Error trace] " + JSON.stringify(trace, undefined, 4));
		return;
	});


	//=====================================================================
	casper.on("run.complete", function()
	{
		logger.LogMessage("Execution complete.");
		this.exit(0);
		return;
	});


	//=====================================================================
	casper.on("page.error", function(msg, trace)
	{
		if (casper.log_page_errors)
		{
			logger.LogMessage("[Remote Page Error] " + msg);
			logger.LogMessage("[Remote Error trace] " + JSON.stringify(trace, undefined, 4));
		}
		return;
	});


	//=====================================================================
	casper.on('remote.message', function(msg)
	{
		if (casper.log_remote_messages)
		{
			logger.LogMessage('[Remote Message] ' + msg);
		}
		return;
	});


	//=====================================================================
	//=====================================================================
	//
	//  ┌─┐┌─┐┌─┐┌─┐┌─┐┬─┐  ┬ ┬┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐┌─┐
	//  │  ├─┤└─┐├─┘├┤ ├┬┘  │││├┬┘├─┤├─┘├─┘├┤ ├┬┘└─┐
	//  └─┘┴ ┴└─┘┴  └─┘┴└─  └┴┘┴└─┴ ┴┴  ┴  └─┘┴└─└─┘
	//
	//=====================================================================
	//=====================================================================


	//=====================================================================
	casper.GetAttributeValue = function GetAttributeValue(Selector, AttributeName, Default)
	{
		if (!this.exists(Selector))
		{
			return Default;
		}
		return this.getElementAttribute(Selector, AttributeName);
	}


	//=====================================================================
	casper.GetElementText = function GetElementText(Selector)
	{
		if (!this.exists(Selector))
		{
			return '';
		}
		return this.fetchText(Selector);
	}


	//=====================================================================
	casper.ClickToDeath = function ClickToDeath(selector, timeout_ms)
	{
		this.waitForSelector(selector,
			function OnResource()
			{
				if (this.exists(selector))
				{
					logger.LogMessage('ClickToDeath [' + selector + ']');
					this.click(selector);
					// this.wait(2000, ClickToDeath(selector));
					this.ClickToDeath(selector);
				}
			},
			function OnTimeout()
			{},
			timeout_ms);

		return;
	}


	//=====================================================================
	casper.GetPageSnapshot = function GetPageSnapshot(SnapshotName, DoSaveImage, DoSaveHtml)
	{
		SnapshotName = SnapshotName || 'snapshot';
		DoSaveImage = DoSaveImage || true;
		DoSaveHtml = DoSaveHtml || true;

		if (DoSaveImage)
		{
			this.capture(SnapshotName + '.jpg');
		}
		if (DoSaveHtml)
		{
			fs.write(SnapshotName + '.html', this.getPageContent(), 'w');
		}

		return;
	}


	//=====================================================================
	casper.ExitNow = function ExitNow(Status, Message)
	{
		logger.LogMessage(Message);
		logger.LogMessage('CASPER WILL NOW EXIT!');
		this.exit(Status);
		this.bypass(99999);
		return;
	}


}