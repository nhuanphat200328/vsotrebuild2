-- 0029: correct a combined name/affiliation imported as one person.
-- Dr Nguyen Thi Hoai An is the person; "Da Nang Hospital" is the institution.
-- Keep the existing slug/URL stable to avoid breaking existing links.

update public.people
set
  full_name = 'Nguyen Thi Hoai An',
  display_name = 'Dr Nguyen Thi Hoai An',
  title = 'Dr',
  institution = 'Da Nang Hospital'
where slug = 'dr-nguyen-thi-hoai-an-da-nang-hospital'
  and full_name = 'Dr Nguyen Thi Hoai An, Da Nang Hospital';
