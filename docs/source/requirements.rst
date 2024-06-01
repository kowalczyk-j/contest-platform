Wymagania projektu
==================

1. Integracja ze stroną internetową:
------------------------------------

.. req:: System ma umożliwiać prostą integrację z aktualną stroną internetową Fundacji. (https://www.fundacjabowarto.pl/)
    :id: REQ_01
    :osoba:
    :priorytet: wysoki

    Na stronie internetowej powinna znajdować się zakładka “Konkursy”; po jej kliknięciu użytkownik ma zostać przekierowany na specjalnie przygotowaną platformę konkursową.

    **Kod realizujący wymaganie:**

    .. literalinclude:: ../../frontend/src/components/Navbar.jsx
        :start-after: REQ_01
        :end-before: REQ_01_END

2. Integracja z bazą adresową:
------------------------------

.. req:: System ma wspierać import danych z pliku csv do bazy danych.
    :id: REQ_02
    :osoba:
    :priorytet: wysoki

    **Kod realizujący wymaganie:**

    .. literalinclude:: ../../backend/contest_platform/csv_import/import_schools_csv.py
        :start-after: REQ_02
        :end-before: REQ_02_END

.. req:: System ma umożliwiać dodawanie nowych rekordów do bazy danych a w szczególności osób/szkół/organizacji wraz z danymi kontaktowymi.
    :id: REQ_03
    :osoba:
    :priorytet: wysoki

    **Kod realizujący wymaganie:**

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_03
        :end-before: REQ_03_END

.. req:: System musi umożliwiać usuwanie rekordów z bazy.
    :id: REQ_04
    :osoba:
    :priorytet: wysoki

    **Kod realizujący wymaganie:**

    .. literalinclude:: ../../frontend/src/components/Entries.jsx
        :start-after: REQ_04
        :end-before: REQ_04_END

.. req:: System powinien umożliwić automatyczne dodawanie uczestnika konkursu do bazy adresowej, jeśli wyrazi on taką zgodę przy rejestracji zgłoszenia.
    :id: REQ_05
    :osoba:
    :priorytet: średni

    **Kod realizujący wymaganie:**

    .. literalinclude:: ../../frontend/src/components/EmailForm.jsx
        :start-after: REQ_05
        :end-before: REQ_05_END

3. Rejestracja administratorów i użytkowników:
-----------------------------------------------

.. req:: System ma umożliwiać rejestrację członkom jury oraz osobom zgłaszającym prace.
    :id: REQ_06
    :osoba:
    :priorytet: średni

    Członkowie jury, uczestnicy indywidualni, liderzy zespołów, koordynatorzy szkół logują się do systemu za pomocą e-maila i hasła.

    **Kod frontendu realizujący wymaganie:**

    .. literalinclude:: ../../frontend/src/components/LoginPage.jsx
        :start-after: REQ_06D
        :end-before: REQ_06D_END


    **Kod backendu realizujący wymaganie:**

    Modele

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_06A
        :end-before: REQ_06A_END

    Widoki

    .. literalinclude:: ../../backend/contest_platform/views.py
        :start-after: REQ_06B
        :end-before: REQ_06B_END

    Serializery

    .. literalinclude:: ../../backend/contest_platform/serializers.py
        :start-after: REQ_06C
        :end-before: REQ_06C_END

.. req:: Uczestnicy mogą edytować swoje dane, które automatycznie będą pobierane do formularza zgłoszeniowego.
    :id: REQ_07
    :osoba:
    :priorytet: średni

    **Kod frontendu realizujący wymaganie:**

    .. literalinclude:: ../../frontend/src/components/UserProfilePage.jsx
        :start-after: REQ_07A
        :end-before: REQ_07A_END

    **Kod backendu realizujący wymaganie:**

    .. literalinclude:: ../../backend/contest_platform/views.py
        :start-after: REQ_07B
        :end-before: REQ_07B_END

.. req:: Administrator systemu musi mieć możliwość nadawania roli innym użytkownikom (koordynator szkoły, juror, administrator).
    :id: REQ_08
    :osoba:
    :priorytet: średni

    - Koordynator posiada możliwość wprowadzania kilku zgłoszeń jednocześnie w imieniu uczniów.
    - Juror posiada jedynie możliwość oceniania i komentowania prac oraz ma dostęp do statystyk.
    - Administrator posiada dodatkowo możliwość zamieszczania konkursów, wysyłki maili i modyfikowania/usuwania danych.

    **Kod frontendu realizujący wymaganie:**

    .. literalinclude:: ../../frontend/src/components/UsersListPage.jsx
        :start-after: REQ_08A
        :end-before: REQ_08A_END

    **Kod backendu realizujący wymaganie:**

    .. literalinclude:: ../../backend/contest_platform/views.py
        :start-after: REQ_08B
        :end-before: REQ_08B_END

4. Zarządzanie konkursami:
--------------------------

.. req:: System ma umożliwiać dodawanie nowych konkursów z określonymi parametrami.
    :id: REQ_09
    :osoba:
    :priorytet: wysoki

    Parametry to nazwa, opis konkursu, harmonogram, regulamin, wyraźnie zaznaczona grupa docelowa, maksymalna liczba prac na uczestnika, dodatkowe dane wymagane w formularzu zgłoszeniowym, wyszczególniona informacja o konieczności wysyłki fizycznej pracy, nieobowiązkowe - nagrody, kategorie oceny dla jury i skład zespołów jury.

    **Parametry konkursu:**

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_09A
        :end-before: REQ_09A_END

    **Parametry oceny przez jury:**

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_09B
        :end-before: REQ_09B_END



.. req:: Harmonogram składa się z par danych (data/zakres dat, opis wydarzenia) w tym musi uwzględniać termin składania prac i ogłoszenia wyników.
    :id: REQ_10
    :osoba:
    :priorytet: wysoki

    Harmonogram konkursu jest zdefiniowany przez datę rozpoczęcia i zakończenia. Pilnowane jest, aby daty były poprawne - data zakończenia nie może być przed datą rozpoczęcia.

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../backend/contest_platform/serializers.py
        :start-after: REQ_10
        :end-before: REQ_10_END

.. req:: Regulamin wgrywany jest jako plik pdf lub docx.
    :id: REQ_11
    :osoba:
    :priorytet: wysoki

    Pliki są przechowywane w Azure.

    **Wgrywanie pliku z regulaminem:**

    .. literalinclude:: ../../frontend/src/components/ContestForm.jsx
        :start-after: REQ_11
        :end-before: REQ_11_END

.. req:: Wybór grupy docelowej odbywa się poprzez wybranie jednego checkboxa z dostępnych: konkurs wyłącznie indywidualny, konkurs grupowy (wymaga zdefiniowania dozwolonej minimalnej i maksymalnej liczby uczestników). (podstawowa wersja obsługuje tylko zgłoszenia indywidualne)
    :id: REQ_12
    :osoba:
    :priorytet: średni

    W zależności od oznaczenia, formularz zgłoszeniowy będzie wyglądał inaczej.

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/ContestForm.jsx
        :start-after: REQ_12
        :end-before: REQ_12_END


.. req:: Dodatkowe dane wymagane w formularzu uczestnika (takie jak adres, data urodzenia) wybierane są z listy.
    :id: REQ_13
    :osoba:
    :priorytet: niski

.. req:: Kategorie ocen dla jury definiuje się jako elementy pracy podlegające ocenie (np. kompozycja, czasochłonność itp.). Wymagane jest wtedy także podanie skali ocen dla wszystkich parametrów jednocześnie. Zdefiniowanie kategorii nie jest obowiązkowe - wówczas jury dokonuje oceny prac wyłącznie poprzez pole tekstowe uwagi i komentarze.
    :id: REQ_14
    :osoba:
    :priorytet: średni

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_09B
        :end-before: REQ_09B_END

.. req:: Skład jury wybiera się z listy administratorów systemu o statusie jury. Istnieje możliwość podzielenia ich na zespoły. W przypadku braku wypełnienia tego parametru, każdy użytkownik o statusie jury lub administrator może oceniać prace konkursowe.
    :id: REQ_15
    :osoba:
    :priorytet: niski

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../backend/contest_platform/views.py
        :start-after: REQ_15
        :end-before: REQ_15_END

.. req:: Platforma ma pozwalać na edytowanie szczegółów związanych z konkursem w dowolnym momencie jego trwania.
    :id: REQ_16
    :osoba:
    :priorytet: niski

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/EditContestPage.jsx
        :start-after: REQ_16
        :end-before: REQ_16_END

5. Powiadomienia mailingowe:
-----------------------------

.. req:: System powinien umożliwiać masową wysyłkę maili do odbiorców z bazy danych w celu poinformowania o nowym konkursie.
    :id: REQ_17
    :osoba:
    :priorytet: wysoki

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../backend/contest_platform/views.py
        :start-after: REQ_17
        :end-before: REQ_17_END

.. req:: Administrator wysyłający maile powinien móc wybrać grupę odbiorców oraz wpisać temat maila i treść z informacją o konkursie i linkiem do platformy konkursowej.
    :id: REQ_18
    :osoba:
    :priorytet: średni

    **Kod realizujący wymaganie:**

    .. literalinclude:: ../../frontend/src/components/EmailForm.jsx
        :start-after: REQ_18
        :end-before: REQ_18_END

.. req:: *Grupa odbiorców może być posortowana w zależności od obszaru zamieszkania; wówczas system umożliwiałby wysłanie maila do wszystkich odbiorców z danego obszaru (np. zaznaczonego na mapie).
    :id: REQ_19
    :osoba:
    :priorytet: niski

.. req:: System powinien wysyłać mailowe potwierdzenie poprawnego zarejestrowania zgłoszenia po każdym wypełnieniu formularza przez uczestnika.
    :id: REQ_20
    :osoba:
    :priorytet: niski

    - Po dodaniu zgłoszenia do osoby dodającej wysyłany jest email z potwierdzeniem

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_20
        :end-before: REQ_20_END

6. Zbieranie i obsługa zgłoszeń:
---------------------------------

.. req:: Platforma konkursowa na stronie głównej powinna prezentować kafelki z krótkim opisem aktualnie trwających konkursów.
    :id: REQ_21
    :osoba:
    :priorytet: wysoki

    - Każdy kafelek posiada widoczny przycisk z napisem “Szczegóły i zgłoszenia”
    - Po kliknięciu przycisku użytkownik zostaje przeniesiony na stronę poświęconą danemu konkursowi


    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/ContestListPage.jsx
        :start-after: REQ_21
        :end-before: REQ_21_END

.. req:: Każdy konkurs posiada własną stronę, która składa się z dwóch części:
    :id: REQ_22
    :osoba:
    :priorytet: wysoki

    - Informacje o konkursie: nazwa, opis konkursu, harmonogram wraz z terminami nadsyłania prac i ogłoszenia wyników, regulamin widoczny po rozwinięciu, wyraźnie zaznaczona grupa docelowa.
    - Formularz zgłoszeniowy z polami do wypełnienia.

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/CreateEntryPage.jsx
        :start-after: REQ_22
        :end-before: REQ_22_END

.. req:: Formularz zgłoszeniowy wyświetlany jest w zależności od parametrów podanych przy tworzeniu konkursu na platformie oraz rodzaju osoby zgłaszającej.
    :id: REQ_23
    :osoba:
    :priorytet: średni

    - Pierwszym krokiem do wypełnienia zgłoszenia i wyświetlenia odpowiedniego formularza jest zaznaczenie jednego z 3 checkboxów: uczestnik indywidualny, dowódca zespołu, koordynator szkoły.
    - Domyślnie zaznaczony i wyświetlany jest formularz dla uczestnika indywidualnego, chyba że dany konkurs dopuszcza jedynie uczestnictwo grupowe - wówczas domyślną opcją jest dowódca zespołu. W przypadku zarejestrowanego użytkownika system podpowiada automatycznie, którą opcję zaznaczyć.
    - Uczestnik indywidualny widzi formularz standardowy opisany poniżej.
    - Dowódca zespołu posiada dodatkowo możliwość podania danych osobowych pozostałych członków zespołu.

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/EntryForm.jsx
        :start-after: REQ_23
        :end-before: REQ_23_END

    Członkowie zespołu definiowani są swoim imieniem i nazwiskiem i przechowywani w tabeli Person:

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_23
        :end-before: REQ_23_END

    - Koordynator szkoły posiada możliwość zamieszczenia większej liczby prac wraz z danymi uczniów/zespołów, którzy je wykonali. Status koordynatora nadawany jest zarejestrowanym użytkownikom przez administratora systemu.

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_23B
        :end-before: REQ_23B_END

    - Zwykły użytkownik jest ograniczony do tylko jednego zgłoszenia w konkursie

    .. literalinclude:: ../../backend/contest_platform/serializers.py
        :start-after: REQ_23
        :end-before: REQ_23_END

.. req:: Standardowy formularz zgłoszeniowy obowiązkowo składa się z pól: imię i nazwisko, adres e-mail, załączona praca, zgoda na przetwarzanie danych osobowych i akceptacja regulaminu.
    :id: REQ_24
    :osoba:
    :priorytet: wysoki

    Zbierane informacje odnośnie zgłoszenia:

    .. literalinclude:: ../../backend/contest_platform/models.py
        :start-after: REQ_24
        :end-before: REQ_24_END


.. req:: System musi umożliwiać wgrywanie prac w formatach png, jpg, … o maksymalnym rozmiarze do 20 MB (definiowanym dla każdej pracy).
    :id: REQ_25
    :osoba:
    :priorytet: wysoki

    Dla konkursów plastycznych przyjmowany jest dowolny typ pliku obrazu, natomiast dla literackich - pdf.

    .. literalinclude:: ../../frontend/src/components/EntryForm.jsx
        :start-after: REQ_25
        :end-before: REQ_25_END

.. req:: Pozostałe dane takie jak nazwa szkoły, adres zamieszkania, data urodzenia uczestnika itp. wyświetlane są w formularzu w zależności od specyfikacji konkursu na etapie ogłaszania go na platformie.
    :id: REQ_26
    :osoba:
    :priorytet: średni

.. req:: Zgoda RODO i akceptacja regulaminu realizowana jest w formie zaznaczenia checkboxa. (* Przy wdrożeniu systemu wymagana jest konsultacja z działem prawnym odnośnie przyjętego rozwiązania)
    :id: REQ_27
    :osoba:
    :priorytet: wysoki

    .. literalinclude:: ../../frontend/src/components/EntryForm.jsx
        :start-after: REQ_27
        :end-before: REQ_27_END


.. req:: System powinien prawidłowo rozróżniać indywidualnych użytkowników i nie pozwalać im na więcej zgłoszeń niż zdefiniowano dla danego konkursu.
    :id: REQ_28
    :osoba:
    :priorytet: średni

    - Unikalność użytkowników rozróżniana jest na podstawie adresów e-mail.
    - W przypadku kolejnego zgłoszenia przez tę samą osobę (adres e-mail), które jest niedozwolone, wyświetlany jest stosowny komunikat.
    - W przypadku zgłoszeń przez koordynatora szkoły, to on odpowiada za regulaminowe zgłoszenie swoich podopiecznych. Przypadki naruszeń regulaminu są rozpatrywane przez jury indywidualnie.

    .. literalinclude:: ../../backend/contest_platform/serializers.py
        :start-after: REQ_23
        :end-before: REQ_23_END

.. req:: Formularz posiada funkcjonalność aktywnego sprawdzania poprawności wpisanych danych (np. sprawdza poprawność maila bądź czy imię nie zawiera cyfr).
    :id: REQ_29
    :osoba:
    :priorytet: średni

    Wymaganie zrealizowane poprzez wewnętrzne mechanizmy form HTML5.

.. req:: System powinien umożliwić administratorom dowolne edytowanie i zarządzanie zgłoszeniami
    :id: REQ_30
    :osoba:
    :priorytet: średni

    - Administrator może dowolnie przeglądać zgłoszenia
    - Może wypełniać i zmieniać zawartość pól w bazie danych
    - Administrator może dodać zgłoszenie ręcznie na przykład za indywidualną prośbą uczestnika

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/Entries.jsx
        :start-after: REQ_33
        :end-before: REQ_33_END

.. req:: System pozwala na pobieranie (ewentualnie wyświetlanie podglądu) plików nadesłanych przez uczestników
    :id: REQ_31
    :osoba:
    :priorytet: wysoki

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/EntryWorkView.jsx
        :start-after: REQ_31
        :end-before: REQ_31_END

7. Ocenianie i jury
--------------------

.. req:: System ma umożliwiać przypisywanie jurorów do konkretnych konkursów w dowolnym momencie jego trwania.
    :id: REQ_32
    :osoba:
    :priorytet: średni

    Jury mogą być podzieleni na zespoły. Wówczas wystarczy ocena wszystkich członków jednego zespołu, aby praca została zaklasyfikowana jako oceniona.

.. req:: System ma wyświetlać każdemu z jury prace konkursowe w przystępnej formie.
    :id: REQ_33
    :osoba:
    :priorytet: średni

    - Praca konkursowa opatrzona jest danymi autora, które są widoczne dopiero po kliknięciu przycisku, aby nie sugerować się nimi przy ocenie.
    - Istnieje możliwość filtrowania prac faworytów oraz prac jeszcze nieocenionych przez danego jurora.

    **Kod realizujący wymaganie:**-

    .. literalinclude:: ../../frontend/src/components/Entries.jsx
        :start-after: REQ_33
        :end-before: REQ_33_END

.. req:: System ma umożliwiać ocenę pracy zgodnie z przyjętymi kryteriami.
    :id: REQ_34
    :osoba:
    :priorytet:

    - Juror wpisuje wartość zgodnie z ustaloną skalą dla każdego kryterium.
    - Opcjonalnie dostępne jest pole “Uwagi” na komentarz tekstowy.

    .. literalinclude:: ../../frontend/src/components/GradeEntry.jsx
        :start-after: REQ_34
        :end-before: REQ_34_END

.. req:: Po ocenie pracy przez każdego jurora system oblicza i wyświetla przy niej średnią ocen.
    :id: REQ_35
    :osoba:
    :priorytet: średni


    .. literalinclude:: ../../frontend/src/components/Entries.jsx
        :start-after: REQ_35
        :end-before: REQ_35_END

8. Raportowanie*
--------------------

.. req:: System ma umożliwiać generowanie statystyk na temat uczestnictwa w konkursie zawierające: liczbę uczestników konkursu, liczbę zgłoszeń prac konkursowych, *liczbę szkół biorących udział, *regiony pochodzenia uczestników, *dane statystyczne na temat wieku uczestników.
    :id: REQ_36
    :osoba:
    :priorytet: średni

    - Jurorzy i administratorzy mogą zobaczyć dane o ilości uczestników i prac na dany konkurs
    - Generowane są też wykresy przedstawiające procent prac grupowych wobec samodzielnych i ilość prac dodanych w każdym dniu konkursu

    .. literalinclude:: ../../backend/contest_platform/views.py
        :start-after: REQ_36
        :end-before: REQ_36_ENDmai


.. req:: System ma umożliwiać generowanie raportu o zwycięzcach konkursu zawierające: dane osobowe zwycięzców możliwe do upublicznienia, ich prace konkursowe, zajęte miejsce / informacje o wyróżnieniu, *średnie ocen prac
    :id: REQ_37
    :osoba:
    :priorytet: niski

.. req:: *System może umożliwiać automatyczne generowanie dyplomu dla zwycięzców.
    :id: REQ_38
    :osoba:
    :priorytet: niski