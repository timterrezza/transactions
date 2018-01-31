var addresses = {
    '0xf4bc22cce0d48ab06befbec2d42936a529a2e708': 'Nighthawk',
    '0xfe04c031c0218c0e0a553a975602d49a8ec98cd8': 'Batman',
    '0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0': 'Superman'
}

var mapAddress = function (address) {
    if (address in addresses) {
        return addresses[address];
    }
    return address;
}

var runAjax = function (walletID) {
    var url = 'http://api.etherscan.io/api?module=account&action=txlist&address=' + walletID + '&sort=desc&apikey=SW25NGAAUTHW11BVBIUCWQRCWHKRSJXJ12',
        startDate = new Date($('#startDate').val()).getTime(),
        endDate = new Date($('#endDate').val()).getTime() + 99999999,
        toTotal = {},
        fromTotal = {};
    $.ajax({
        url: url,
        error: function (err) {
            console.log(err);
        },
        success: function (data) {
            console.log(data.result);
            for (var i = 0; i < data.result.length; i++) {
                var time = data.result[i].timeStamp * 1000;
                if (data.result[i].value > 0 && time > startDate && time < endDate) {
                    var dateObject = new Date(time);
                    var date = (dateObject.getMonth() + 1) + '/' + (dateObject.getDate()) + '/' + dateObject.getFullYear();
                    var to = mapAddress(data.result[i].to);
                    var from = mapAddress(data.result[i].from);
                    var amount = data.result[i].value / 1000000000000000000;
                    var markup = '<tr><td>' + date + '</td><td>' + to + '</td><td>' + from + '</td><td>' + amount + '</td></tr>';
                    $('#transactionTable tbody').append(markup);
                }
                if (to != 'Kyle Gibbons') {
                    if (toTotal[to]) {
                        toTotal[to] += amount;
                    }
                    else {
                        toTotal[to] = amount;
                    }
                }
                if (from != 'Kyle Gibbons') {
                    if (fromTotal[from]) {
                        fromTotal[from] += amount;
                    }
                    else {
                        fromTotal[from] = amount;
                    }
                }
            }
            for (var key in toTotal) {
                var markup = '<tr><td>' + key + '</td><td>' + toTotal[key];
                $('#toTable tbody').append(markup);
            }
            for (var key in fromTotal) {
                var markup = '<tr><td>' + key + '</td><td>' + fromTotal[key];
                $('#fromTable tbody').append(markup);
            }
        }
    });
}

$(function () {
    $('#getTransactionsButton').click(function () {
        var inputVal = $('#walletID').val();
        $('table tbody tr').remove();
        if (inputVal === '') {
            runAjax('0xf4BC22Cce0D48Ab06BEFbeC2d42936a529a2E708');
        }
        else {
            runAjax(inputVal);
        }
    });
});
