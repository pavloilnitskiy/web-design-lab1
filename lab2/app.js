class SessionModel {
    constructor() {
        
        this.sessions = JSON.parse(localStorage.getItem('sessions')) || [];
    }

    addSession(session) {
        this.sessions.push(session);
        this._commit(this.sessions);
    }

    getSessions() {
        return this.sessions;
    }

    
    _commit(sessions) {
        localStorage.setItem('sessions', JSON.stringify(sessions));
    }
}


class SessionView {
    constructor() {
        
        this.taskInput = document.getElementById('task-name');
        this.timerDisplay = document.getElementById('timer-display');
        this.btnStart = document.getElementById('btn-start');
        this.btnPause = document.getElementById('btn-pause');
        this.btnStop = document.getElementById('btn-stop');
        this.tableBody = document.getElementById('sessions-table-body');
    }


    updateTimerDisplay(timeString) {
        this.timerDisplay.textContent = timeString;
    }


    getTaskName() {
        return this.taskInput.value.trim() || 'Без назви';
    }


    clearTaskInput() {
        this.taskInput.value = '';
    }


    renderSessions(sessions) {
        this.tableBody.innerHTML = '';
        
        sessions.forEach(session => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-slate-700 hover:bg-slate-750 transition';
            
            tr.innerHTML = `
                <td class="py-3 px-4">${session.name}</td>
                <td class="py-3 px-4 text-sm text-slate-400">${session.startTime}</td>
                <td class="py-3 px-4 text-sm text-slate-400">${session.endTime}</td>
                <td class="py-3 px-4 text-right font-mono text-blue-400">${session.duration}</td>
            `;
            
            this.tableBody.appendChild(tr);
        });
    }


    bindStartTimer(handler) {
        this.btnStart.addEventListener('click', handler);
    }

    bindPauseTimer(handler) {
        this.btnPause.addEventListener('click', handler);
    }

    bindStopTimer(handler) {
        this.btnStop.addEventListener('click', handler);
    }
}


class SessionController {
    constructor(model, view) {
        this.model = model;
        this.view = view;


        this.timerInterval = null;
        this.secondsElapsed = 0;
        this.isTimerRunning = false;
        this.startTimeStr = '';


        this.view.bindStartTimer(this.handleStart.bind(this));
        this.view.bindPauseTimer(this.handlePause.bind(this));
        this.view.bindStopTimer(this.handleStop.bind(this));


        this.view.renderSessions(this.model.getSessions());
    }


    formatTime(totalSeconds) {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }


    getCurrentTimeStr() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

    handleStart() {
        if (this.isTimerRunning) return;


        if (this.secondsElapsed === 0) {
            this.startTimeStr = this.getCurrentTimeStr();
        }

        this.isTimerRunning = true;
        

        this.timerInterval = setInterval(() => {
            this.secondsElapsed++;
            this.view.updateTimerDisplay(this.formatTime(this.secondsElapsed));
        }, 1000);
    }

    handlePause() {
        if (!this.isTimerRunning) return;
        
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;
    }

    handleStop() {
        if (this.secondsElapsed === 0) return;

        clearInterval(this.timerInterval);
        this.isTimerRunning = false;

        const endTimeStr = this.getCurrentTimeStr();
        const durationStr = this.formatTime(this.secondsElapsed);
        const taskName = this.view.getTaskName();


        const newSession = {
            name: taskName,
            startTime: this.startTimeStr,
            endTime: endTimeStr,
            duration: durationStr
        };


        this.model.addSession(newSession);
        this.view.renderSessions(this.model.getSessions());


        this.secondsElapsed = 0;
        this.view.updateTimerDisplay('00:00:00');
        this.view.clearTaskInput();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = new SessionController(new SessionModel(), new SessionView());
});