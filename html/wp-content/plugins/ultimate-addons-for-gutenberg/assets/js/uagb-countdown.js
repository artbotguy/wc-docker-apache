UAGBCountdown = { // eslint-disable-line no-undef
	elements: {},
	countdownInterval: {},

	editorInit( mainSelector, data = {}, countdownRef ) {

		// When a new Countdown timer block is added, the timeModified value received is 'false',
		// even though it's attribute has been set to 'true'.
		// Hence, we need to ensure here that the dynamic defaults are followed. 
		if( ! data.timeModified ) {

			const d = new Date();

			// Set the default end time to 7 days later.
			d.setMilliseconds( d.getMilliseconds() + ( 7 * 24 * 60 * 60 * 1000 ) );

			data.endDateTime = d;
		}

        this.elements[mainSelector] = this.getElement( mainSelector );

		this.countdownInterval[ mainSelector ] = setInterval( () => {
			this.updateCountdown( mainSelector, data, true, countdownRef );
		}, 1000 );
	},

	init( mainSelector, data = {} ) {

        this.elements[mainSelector] = this.getElement( mainSelector );

        if( typeof this.elements[ mainSelector ] !== 'undefined' ){
            this.countdownInterval[ mainSelector ] = setInterval( () => {
                this.updateCountdown( mainSelector, data );
            }, 1000 );

		}

	},

	changeEndTime( mainSelector, data = {}, ref ) {

		clearInterval( this.countdownInterval[ mainSelector ] );

        if( typeof this.elements[ mainSelector ] !== 'undefined' ){
            this.countdownInterval[ mainSelector ] = setInterval( () => {
                this.updateCountdown( mainSelector, data, true, ref );
            }, 1000 );
		}
	},

	getElement( selector ) {

		let domElement = document.querySelector( selector );

		const editorCanvas = document.querySelector(
			'iframe[name="editor-canvas"]'
		);

		if ( editorCanvas && editorCanvas.contentDocument ) {
			domElement = editorCanvas.contentDocument.querySelector(
				selector
			);
		}

		return domElement;
	},

    updateCountdown( mainSelector, data, isEditor = false, ref = null ) {
		
		if( isEditor && ! ref ){
			return;
		}

		// If show days or show hours is true, set the further units to true ( hours, minutes ).
		if ( data.showDays ) {
			data.showHours = true;
			data.showMinutes = true;
		}

		if( data.showHours ) {
			data.showMinutes = true;
		}

		// Wrappers.
		let daysWrap;
		let hoursWrap;
		let minutesWrap;
		let secondsWrap;

		if( isEditor ) {

			if ( data.showDays ) {
				daysWrap = ref.querySelector( '.wp-block-uagb-countdown__time-days' );
			}

			if ( data.showHours ) {
				hoursWrap = ref.querySelector( '.wp-block-uagb-countdown__time-hours' );
			}

			if ( data.showMinutes ) {
				minutesWrap = ref.querySelector( '.wp-block-uagb-countdown__time-minutes' );
			}

			secondsWrap = ref.querySelector( '.wp-block-uagb-countdown__time-seconds' );

		} else {

			if ( data.showDays ) {
				daysWrap = this.elements[ mainSelector ]?.querySelector( '.wp-block-uagb-countdown__time-days' );
			}

			if ( data.showHours ) {
				hoursWrap = this.elements[ mainSelector ]?.querySelector( '.wp-block-uagb-countdown__time-hours' );
			}

			if( data.showMinutes ) {
				minutesWrap = this.elements[ mainSelector ]?.querySelector( '.wp-block-uagb-countdown__time-minutes' );
			}

			secondsWrap = this.elements[ mainSelector ]?.querySelector( '.wp-block-uagb-countdown__time-seconds' );

		}

        // Calculations.
        const currentTime = new Date();
        const endDateTime = new Date( data.endDateTime );
        const diff = endDateTime - currentTime;
        const isOvertime = diff < 0;

        // Calculations for each unit.
        const days = Math.floor( diff / 1000 / 60 / 60 / 24 );
        let hours = Math.floor( diff / 1000 / 60 / 60 ) % 24;
        let minutes = Math.floor( diff / 1000 / 60 ) % 60;
        let seconds = Math.floor( diff / 1000 ) % 60;

		if( ! data.showDays ) {
			hours = hours + ( days * 24 );
		}

		if( ! data.showHours ) {
			minutes = minutes + ( hours * 60 );
		}

		if( ! data.showMinutes ) {
			seconds = seconds + ( minutes * 60 );
		}

        // Update the markup - Also, we check if the wrappers exist to avoid potential console errors.
		if( data.showDays && daysWrap ) {
			daysWrap.innerHTML = ( ! isOvertime ) ? days : 0;
		}

		if( data.showHours && hoursWrap ) {
			hoursWrap.innerHTML = ( ! isOvertime ) ? hours : 0;
		}

		if( data.showMinutes && minutesWrap ) {
			minutesWrap.innerHTML = ( ! isOvertime ) ? minutes : 0;
		}

		if ( secondsWrap ) {
			secondsWrap.innerHTML = ( ! isOvertime ) ? seconds : 0;
		}

		// If it's overtime, stop updating the markup and clear the interval.
		if( isOvertime ) {
			clearInterval( this.countdownInterval[ mainSelector ] );
		}

    }

};
