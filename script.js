console.log("Mims Express Labs website loaded");

// Example alert (optional)
function showMessage() {
  alert("Thank you for contacting Mims Express Labs LLC!");
}

// Facility Inquiry modal behavior
document.addEventListener('DOMContentLoaded', function () {
  function openFacilityModal() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.classList.add('open');
  }

  function closeFacilityModal() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.classList.remove('open');
  }

  document.body.addEventListener('click', function (e) {
    if (e.target.matches('.facility-inquiry')) {
      e.preventDefault();
      openFacilityModal();
    }
    if (e.target.matches('.modal-backdrop') || e.target.matches('.modal .close')) {
      closeFacilityModal();
    }
    // open schedule modal
    if (e.target.matches('.schedule-draw')) {
      e.preventDefault();
      const sb = document.querySelector('.schedule-backdrop');
      if (sb) sb.classList.add('open');
      // render calendar inside modal when opened
      const modal = document.querySelector('.schedule-backdrop .schedule-modal');
      if (modal) renderInlineCalendar(modal);
    }
    if (e.target.matches('.schedule-backdrop') || e.target.matches('.schedule-modal .close')) {
      const sb = document.querySelector('.schedule-backdrop');
      if (sb) sb.classList.remove('open');
    }
  });

  // handle submit
  const form = document.getElementById('facility-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      // Simple client-side validation
      if (!data.get('facility') || !data.get('contact') || !data.get('email')) {
        alert('Please fill in Facility, Contact name, and Email.');
        return;
      }
      // In a static site we can't POST to a server here — prepare mailto as fallback
      const subject = encodeURIComponent('Facility Inquiry from ' + data.get('facility'));
      let body = '';
      for (const [k,v] of data.entries()) body += `${k}: ${v}\n`;
      const mailto = `mailto:karen@mimsexpresslabs.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      // close modal
      closeFacilityModal();
    });
  }

  // Inline calendar renderer
  function renderInlineCalendar(modal) {
    if (!modal) return;
    // avoid rendering twice
    if (modal.querySelector('.inline-calendar')) return;
    const dateInput = modal.querySelector('input[name="date"]');
    const container = document.createElement('div');
    container.className = 'inline-calendar';

    // header
    const header = document.createElement('div'); header.className = 'cal-header';
    const prev = document.createElement('button'); prev.textContent = '<'; prev.className='btn';
    const next = document.createElement('button'); next.textContent = '>'; next.className='btn';
    const title = document.createElement('div'); title.style.fontWeight='600';
    header.appendChild(prev); header.appendChild(title); header.appendChild(next);
    container.appendChild(header);

    const grid = document.createElement('div'); grid.className = 'cal-grid';
    // weekday labels
    const weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    weekdays.forEach(w=>{ const el=document.createElement('div'); el.className='cal-weekday'; el.textContent=w; grid.appendChild(el); });

    container.appendChild(grid);
    modal.querySelector('.actions').before(container);

    let current = new Date();
    current.setDate(1);

    function draw() {
      title.textContent = current.toLocaleString(undefined,{month:'long', year:'numeric'});
      // remove old day cells
      Array.from(grid.querySelectorAll('.cal-cell')).forEach(n=>n.remove());
      const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
      const startOffset = firstDay.getDay();
      const daysInMonth = new Date(current.getFullYear(), current.getMonth()+1, 0).getDate();

      // previous month's trailing days
      const prevMonthDays = startOffset;
      const prevMonthLast = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
      for (let i=prevMonthDays-1;i>=0;i--) {
        const d = prevMonthLast - i;
        const cell = document.createElement('div'); cell.className='cal-cell other'; cell.textContent=d; grid.appendChild(cell);
      }

      for (let d=1; d<=daysInMonth; d++) {
        const cell = document.createElement('div'); cell.className='cal-cell'; cell.textContent=d;
        const cellDate = new Date(current.getFullYear(), current.getMonth(), d);
          cell.addEventListener('click', ()=>{
            // restrict weekends
            const w = cellDate.getDay();
            if (w===0 || w===6) { alert('Weekends unavailable for scheduling. Please pick a weekday.'); return; }
            const yyyy = cellDate.getFullYear();
            const mm = String(cellDate.getMonth()+1).padStart(2,'0');
            const dd = String(cellDate.getDate()).padStart(2,'0');
            if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
            // mark selection
            Array.from(container.querySelectorAll('.cal-cell.selected')).forEach(n=>n.classList.remove('selected'));
            cell.classList.add('selected');
            // populate time slots for this date
            populateTimeSlots(container, cellDate);
          });
        // highlight if equals input
        if (dateInput && dateInput.value) {
          const [iy,im,id] = dateInput.value.split('-').map(Number);
          if (iy===cellDate.getFullYear() && im===cellDate.getMonth()+1 && id===cellDate.getDate()) cell.classList.add('selected');
        }
        grid.appendChild(cell);
      }

      // next month's leading cells to fill grid (optional)
      const totalCells = grid.querySelectorAll('.cal-cell').length + weekdays.length; // including weekdays
      const remainder = (7 - (totalCells % 7)) % 7;
      for (let i=1;i<=remainder;i++) { const c=document.createElement('div'); c.className='cal-cell other'; c.textContent=''; grid.appendChild(c); }
    }

    // populateTimeSlots function attaches/updates the time slot picker inside the calendar container
    function populateTimeSlots(containerEl, dateObj) {
      // remove existing time slots area
      let ts = containerEl.parentElement.querySelector('.time-slots');
      if (ts) ts.remove();
      ts = document.createElement('div'); ts.className = 'time-slots';
      // business hours 08:00 - 16:00, 30min slots
      const startHour = 8, endHour = 16;
      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          const hh = String(h).padStart(2,'0');
          const mm = String(m).padStart(2,'0');
          const timeStr = `${hh}:${mm}`;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'time-slot';
          btn.textContent = timeStr;
          btn.addEventListener('click', ()=>{
            // set time input in modal
            const timeInput = containerEl.parentElement.querySelector('input[name="time"]');
            if (timeInput) timeInput.value = timeStr;
            // mark selection
            Array.from(ts.querySelectorAll('.time-slot.selected')).forEach(n=>n.classList.remove('selected'));
            btn.classList.add('selected');
          });
          ts.appendChild(btn);
        }
      }
      containerEl.parentElement.querySelector('.actions').before(ts);
    }

    prev.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()-1, 1); draw(); });
    next.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()+1, 1); draw(); });
    draw();
  }
  // schedule form handling
  const scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(scheduleForm);
      if (!data.get('name') || !data.get('email') || !data.get('date') || !data.get('time')) {
        alert('Please fill in Name, Email, Date and Time for the appointment.');
        return;
      }
      // Prepare event details
      const name = data.get('name');
      const email = data.get('email');
      const phone = data.get('phone') || '';
      const date = data.get('date');
      const time = data.get('time');
      const notes = data.get('notes') || '';

      const start = new Date(date + 'T' + time);
      // assume 30 minute default
      const end = new Date(start.getTime() + 30*60000);

      function toICSDate(d) {
        return d.toISOString().replace(/[-:]|\.\d{3}/g, '');
      }

      const uid = 'mims-' + Date.now();
      const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Mims Express Labs//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${toICSDate(new Date())}`,
        `DTSTART:${toICSDate(start)}`,
        `DTEND:${toICSDate(end)}`,
        `SUMMARY:Appointment - ${name}`,
        `DESCRIPTION:Requested by ${name} (${email} ${phone})\nNotes: ${notes}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ];

      const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const icsUrl = URL.createObjectURL(icsBlob);

      // Trigger ICS download
      const a = document.createElement('a');
      a.href = icsUrl;
      a.download = `mims-appointment-${date}-${time}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(icsUrl);

      // Open Google Calendar event creation in a new tab
      const gStart = encodeURIComponent(start.toISOString());
      const gEnd = encodeURIComponent(end.toISOString());
      const gText = encodeURIComponent(`Appointment - ${name}`);
      const gDetails = encodeURIComponent(`Requested by ${name} (${email} ${phone})\nNotes: ${notes}`);
      const gLocation = '';
      const gUrl = `https://calendar.google.com/calendar/r/eventedit?text=${gText}&dates=${toICSDate(start)}/${toICSDate(end)}&details=${gDetails}&location=${encodeURIComponent(gLocation)}`;
      window.open(gUrl, '_blank');

      // Also notify via mailto to stakeholder
      const subject = encodeURIComponent('Schedule a Draw: ' + name);
      let body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nNotes: ${notes}`;
      const mailto = `mailto:karen@expresslabs.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      // open mail client in a new window
      window.location.href = mailto;

      const sb = document.querySelector('.schedule-backdrop');
      if (sb) sb.classList.remove('open');
    });
  }
});
