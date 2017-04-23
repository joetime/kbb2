angular.module('kbbApp', [])
    .controller('kbbCtrl', ['$scope', '$http', function ($scope, $http) {

        var apiKey = 'AIzaSyCo-_b7KEPky0Hz7gxC-H60wVRROv6BUqU';

        $scope.calEvents = [];

        function parseEvents(events) {
            // parse entries
            var lst = [];
            angular.forEach(events, function (ev, index) {

                //var dateString = cleanDate(ev.start.dateTime);
                var date = parseDate(ev.start.dateTime);

                var title = parseTitle(ev.summary);
                var where = ev.location;
                var tonightText = "";

                //console.log(moment(ev.start.dateTime).format('dd'));

                /* tonight
                if (moment(ev.start.dateTime).dayOfYear() == moment().dayOfYear())
                    tonightText = "Tonight!";
                // tomorrow 
                if (moment(ev.start.dateTime).dayOfYear() == moment().dayOfYear() + 1)
                    tonightText = "Tomorrow!";
                // this week
                if (moment(ev.start.dateTime).dayOfYear() < moment().dayOfYear() + 106)
                    tonightText = "This " + moment(ev.start.dateTime).format('dddd') + "!";
                */
                //console.log(moment(ev.start.dateTime).dayOfYear() + '==' + (moment().dayOfYear() + 15));

                lst.push({ date: date, title: title, where: where, tonightText: tonightText });
            });

            $scope.calEvents = lst;
        }

        function parseTitle(str) {

            if (str.indexOf('KBB @ ') > -1) return str.split(' @ ')[1].trim();
            if (str.indexOf('KBB at ') > -1) return str.split(' at ')[1].trim();
            else return str;
        }

        function parseWhere(str) {
            var where = {};
            if (str.toLowerCase().indexOf("leadb") >= 0) {
                where.name = "Leadbetters Tavern";
                where.website = "http://www.leadbetterstavern.com";
                where.mapLink = "https://goo.gl/maps/nHhHp";
            }
            else if (str.toLowerCase().indexOf("cat") >= 0) {
                where.name = "Cat's Eye Pub";
                where.website = "http://www.catseyepub.com";
                where.mapLink = "https://goo.gl/maps/HfWbR";
            }
            else if (str.toLowerCase().indexOf("admiral") >= 0) {
                where.name = "The Admirals Cup";
                where.website = "http://www.theadmiralscup.com";
                where.mapLink = "https://goo.gl/maps/h5Fol";
            }
            else {
                where.name = str;
            }

            return where;
        }

        function parseDate(str) {
            // format is: 2015-12-22T21:00:00-05:00
            var mom = moment(str);
            //console.log('moment:', mom);
            return {
                dayOfWeek: mom.format('dddd'),
                month: mom.format('MMMM'),
                day: mom.format('D'),
                year: mom.format('YYYY'),
                time: mom.format('h:mm A')
            }
        }

        var calendarId = '6ebfnlaom2hdleqk54b6ne9adc@group.calendar.google.com';
        var maxResults = 10;

        var timeMin = moment().subtract(6, 'hour').format(); //'2015-11-20T00:00:01Z';
        console.log(timeMin);

        var url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?' +
            'key=' + apiKey +
            '&singleEvents=true' +
            '&maxResults=' + maxResults +
            '&orderBy=starttime' +
            '&fields=items(description%2Clocation%2Cstart%2FdateTime%2Csummary)%2Csummary' +
            '&timeMin=' + timeMin;

        $http.get(url)
            .then(function (resp) {
                console.log(resp.data.items);
                parseEvents(resp.data.items);
            },
            //error
            function (resp) {
                $scope.errorMessage = "Oops, there was a problem loading our calendar, but...";
                console.log(resp);
            });

    }]);