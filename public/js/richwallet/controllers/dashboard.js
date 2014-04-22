richwallet.controllers.Dashboard = function() {};

richwallet.controllers.Dashboard.prototype = new richwallet.Controller();

richwallet.controllers.Dashboard.prototype.renderDashboard = function() {
    var i = 0;
    var self = this;

    /*$('#balance').text(richwallet.wallet.safeUnspentBalance());
      $('#pendingBalance').text(richwallet.wallet.pendingUnspentBalance()); */
    var txs = richwallet.wallet.transactions;
    var txHashes = [];

    function drawDashboard() {
	var balances = richwallet.wallet.balances().sort(function(a, b) {return b.balance - a.balance;});
	txs = txs.sort(function(a, b) {return a.time - b.time;});
      
	self.template('currencyBalances', 'dashboard/balances', {balances:balances}, function(id) {
	    $('#'+id+" [rel='tooltip']").tooltip();
	});

	self.template('allTransactions', 'dashboard/transactions', {tx: txs.reverse()}, function(id) {
	    $('#'+id+" [rel='tooltip']").tooltip();
	});
    }

    drawDashboard();

    for(i=0;i<txs.length;i++) {
	txHashes.push({tx:txs[i].hash, network:txs[i].network});
    }
  
    this.getTxDetails(txHashes, function(resp) {
	for(i=0;i<txs.length;i++) {
	    for(var j=0;j<resp.length;j++) {
		if(txs[i].hash == resp[j].hash)
		    txs[i].confirmations = resp[j].confirmations;
	    }
	}
	drawDashboard();
  });
};

richwallet.controllers.Dashboard.prototype.index = function() {
  var i = 0;
  var self = this;

  this.render('dashboard', {}, function() {
    if(!self.firstDashboardLoad) {
      $('.loading').show();
      self.firstDashboardLoad = true;
      self.getUnspent(function() {
        $('.loading').remove();
        self.renderDashboard();
      });
    } else {
      self.renderDashboard();
    }
  });
};

richwallet.controllers.dashboard = new richwallet.controllers.Dashboard();