var addresses = {
    '0xf4bc22cce0d48ab06befbec2d42936a529a2e708': 'Nighthawk',
    '0xfe04c031c0218c0e0a553a975602d49a8ec98cd8': 'Batman',
    '0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0': 'Superman'
}

var mapAddress = function(address) {
    address = address.toLowerCase();
    if (address in addresses) {
        return addresses[address];
    }
    return address;
}

var setupAggregate = function(totalObject, jQuerySelector) {
    for (var key in totalObject) {
        var markup = '<tr><td>' + key + '</td><td>' + totalObject[key];
        $(jQuerySelector).append(markup);
    }
}

var showSpinner = function () {
    $('#spinner').removeClass('hide');
    $('#spinner').addClass('show');
}

var hideSpinner = function () {
    $('#spinner').removeClass('show');
    $('#spinner').addClass('hide');
}

var setupData = function(result, walletID) {
    var startDate = new Date($('#startDate').val()).getTime(),
        endDate = new Date($('#endDate').val()).getTime() + 99999999,
        toTotal = {},
        fromTotal = {},
        time, dateObject, date, to, from, amount, markup;
    for (var i = 0; i < result.length; i++) {
        time = result[i].timeStamp * 1000;
        if (result[i].value > 0 && time > startDate && time < endDate) {
            dateObject = new Date(time);
            date = (dateObject.getMonth() + 1) + '/' + (dateObject.getDate()) + '/' + dateObject.getFullYear();
            to = mapAddress(result[i].to);
            from = mapAddress(result[i].from);
            amount = result[i].value / 1000000000000000000;
            markup = '<tr><td>' + date + '</td><td>' + to + '</td><td>' + from + '</td><td>' + amount + '</td></tr>';
            $('#transactionTable tbody').append(markup);
        }
        if (to != mapAddress(walletID)) {
            if (toTotal[to]) {
                toTotal[to] += amount;
            }
            else {
                toTotal[to] = amount;
            }
        }
        if (from != mapAddress(walletID)) {
            if (fromTotal[from]) {
                fromTotal[from] += amount;
            }
            else {
                fromTotal[from] = amount;
            }
        }
    }
    setupAggregate(toTotal, '#toTable tbody');
    setupAggregate(fromTotal, '#fromTable tbody');
}

var runAjax = function (walletID) {
    var url = 'http://api.etherscan.io/api?module=account&action=txlist&address=' + walletID + '&sort=desc&apikey=SW25NGAAUTHW11BVBIUCWQRCWHKRSJXJ12';
    $.ajax({
        url: url,
        error: function (err) {
            $('#error').text(err);
            hideSpinner();
        },
        success: function (data) {
            setupData(data.result, walletID);
            hideSpinner();
        }
    });
}

$(function () {
    $('#getTransactionsButton').click(function () {
        var defaultAddress = '0xf4BC22Cce0D48Ab06BEFbeC2d42936a529a2E708';
        var inputVal = $('#walletID').val();
        $('#pageHeader').text(inputVal ? mapAddress(inputVal) : mapAddress(defaultAddress));
        $('table tbody tr').remove();
        showSpinner();
        runAjax(inputVal || defaultAddress);
    });
});
