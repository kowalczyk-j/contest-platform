Wymagania projektu
==================

1. Integracja ze stroną internetową:
------------------------------------

.. req:: System ma umożliwiać prostą integrację z aktualną stroną internetową Fundacji. (https://www.fundacjabowarto.pl/) 
    :id: REQ_01
    :osoba: Jakub Kowalczyk
    :priorytet: wysoki

    Na stronie internetowej powinna znajdować się zakładka “Konkursy”; po jej kliknięciu użytkownik ma zostać przekierowany na specjalnie przygotowaną platformę konkursową.

    Kod realizujący wymaganie:
    --------------------------

    .. literalinclude:: ../../backend/manage.py
        :start-after: REQ_01
        :end-before: REQ_01_END

2. Integracja z bazą adresową:
------------------------------

.. req:: System ma wspierać import danych z pliku csv do bazy danych.
    :id: REQ_02
    :osoba:
    :priorytet: wysoki

.. req:: System ma umożliwiać dodawanie nowych rekordów do bazy danych a w szczególności osób/szkół/organizacji wraz z danymi kontaktowymi.
    :id: REQ_03
    :osoba:
    :priorytet: wysoki

.. req:: System musi umożliwiać usuwanie rekordów z bazy.
    :id: REQ_04
    :osoba:
    :priorytet: wysoki

.. req:: System powinien umożliwić automatyczne dodawanie uczestnika konkursu do bazy adresowej, jeśli wyrazi on taką zgodę przy rejestracji zgłoszenia.
    :id: REQ_05
    :osoba:
    :priorytet: średni

    Zgoda na zapisanie do bazy adresowej realizowana jest poprzez zaznaczenie checkboxa.

3. Rejestracja administratorów i użytkowników:
-----------------------------------------------

.. req:: System ma umożliwiać rejestrację członkom jury oraz osobom zgłaszającym prace.
    :id: REQ_06
    :osoba:
    :priorytet: średni

    Członkowie jury, uczestnicy indywidualni, liderzy zespołów, koordynatorzy szkół logują się do systemu za pomocą e-maila i hasła.

.. req:: Uczestnicy mogą edytować swoje dane, które automatycznie będą pobierane do formularza zgłoszeniowego.
    :id: REQ_07
    :osoba:
    :priorytet: średni

.. req:: Administrator systemu musi mieć możliwość nadawania roli innym użytkownikom (koordynator szkoły, juror, administrator).
    :id: REQ_08
    :osoba:
    :priorytet: średni

    - Koordynator posiada możliwość wprowadzania kilku zgłoszeń jednocześnie w imieniu uczniów.
    - Juror posiada jedynie możliwość oceniania i komentowania prac oraz ma dostęp do statystyk.
    - Administrator posiada dodatkowo możliwość zamieszczania konkursów, wysyłki maili i modyfikowania/usuwania danych.

4. Zarządzanie konkursami:
--------------------------

.. req:: System ma umożliwiać dodawanie nowych konkursów z określonymi parametrami.
    :id: REQ_09
    :osoba:
    :priorytet: wysoki

    Parametry to nazwa, opis konkursu, harmonogram, regulamin, wyraźnie zaznaczona grupa docelowa, maksymalna liczba prac na uczestnika, dodatkowe dane wymagane w formularzu zgłoszeniowym, wyszczególniona informacja o konieczności wysyłki fizycznej pracy, nieobowiązkowe - nagrody, kategorie oceny dla jury i skład zespołów jury.

.. req:: Harmonogram składa się z par danych (data/zakres dat, opis wydarzenia) w tym musi uwzględniać termin składania prac i ogłoszenia wyników.
    :id: REQ_10
    :osoba:
    :priorytet: wysoki

.. req:: Regulamin wgrywany jest jako plik pdf lub docx.
    :id: REQ_11
    :osoba:
    :priorytet: wysoki

.. req:: Wybór grupy docelowej odbywa się poprzez wybranie jednego checkboxa z dostępnych: konkurs wyłącznie indywidualny, konkurs grupowy (wymaga zdefiniowania dozwolonej minimalnej i maksymalnej liczby uczestników). (podstawowa wersja obsługuje tylko zgłoszenia indywidualne)
    :id: REQ_12
    :osoba:
    :priorytet: średni

.. req:: Dodatkowe dane wymagane w formularzu uczestnika (takie jak adres, data urodzenia) wybierane są z listy.
    :id: REQ_13
    :osoba:
    :priorytet: niski

.. req:: Kategorie ocen dla jury definiuje się jako elementy pracy podlegające ocenie (np. kompozycja, czasochłonność itp.). Wymagane jest wtedy także podanie skali ocen dla wszystkich parametrów jednocześnie. Zdefiniowanie kategorii nie jest obowiązkowe - wówczas jury dokonuje oceny prac wyłącznie poprzez pole tekstowe uwagi i komentarze.
    :id: REQ_14
    :osoba:
    :priorytet: średni

.. req:: Skład jury wybiera się z listy administratorów systemu o statusie jury. Istnieje możliwość podzielenia ich na zespoły. W przypadku braku wypełnienia tego parametru, każdy użytkownik o statusie jury lub administrator może oceniać prace konkursowe.
    :id: REQ_15
    :osoba:
    :priorytet: niski

.. req:: Platforma ma pozwalać na edytowanie szczegółów związanych z konkursem w dowolnym momencie jego trwania.
    :id: REQ_16
    :osoba:
    :priorytet: niski

5. Powiadomienia mailingowe:
----------------------------

.. req:: System powinien umożliwiać masową wysyłkę maili do odbiorców z bazy danych w celu poinformowania o nowym konkursie.
    :id: REQ_17
    :osoba:
    :priorytet: wysoki

.. req:: Administrator wysyłający maile powinien móc wybrać grupę odbiorców oraz wpisać temat maila i treść z informacją o konkursie i linkiem do platformy konkursowej.
    :id: REQ_18
    :osoba:
    :priorytet: średni

.. req:: *Grupa odbiorców może być posortowana w zależności od obszaru zamieszkania; wówczas system umożliwiałby wysłanie maila do wszystkich odbiorców z danego obszaru (np. zaznaczonego na mapie).
    :id: REQ_19
    :osoba:
    :priorytet: niski

.. req:: System powinien wysyłać mailowe potwierdzenie poprawnego zarejestrowania zgłoszenia po każdym wypełnieniu formularza przez uczestnika.
    :id: REQ_20
    :osoba:
    :priorytet: wysoki

6. Zbieranie i obsługa zgłoszeń:
--------------------------------

.. req:: Platforma konkursowa na stronie głównej powinna prezentować kafelki z krótkim opisem aktualnie trwających konkursów.
    :id: REQ_21
    :osoba:
    :priorytet: wysoki

    - Każdy kafelek posiada widoczny przycisk z napisem “Szczegóły i zgłoszenia”
    - Po kliknięciu przycisku użytkownik zostaje przeniesiony na stronę poświęconą danemu konkursowi

.. req:: Każdy konkurs posiada własną stronę, która składa się z dwóch części:
    :id: REQ_22
    :osoba:
    :priorytet: wysoki

    - Informacje o konkursie: nazwa, opis konkursu, harmonogram wraz z terminami nadsyłania prac i ogłoszenia wyników, regulamin widoczny po rozwinięciu, wyraźnie zaznaczona grupa docelowa.
    - Formularz zgłoszeniowy z polami do wypełnienia.

.. req:: Formularz zgłoszeniowy wyświetlany jest w zależności od parametrów podanych przy tworzeniu konkursu na platformie oraz rodzaju osoby zgłaszającej.
    :id: REQ_23
    :osoba:
    :priorytet: średni

    - Pierwszym krokiem do wypełnienia zgłoszenia i wyświetlenia odpowiedniego formularza jest zaznaczenie jednego z 3 checkboxów: uczestnik indywidualny, dowódca zespołu, koordynator szkoły.
    - Domyślnie zaznaczony i wyświetlany jest formularz dla uczestnika indywidualnego, chyba że dany konkurs dopuszcza jedynie uczestnictwo grupowe - wówczas domyślną opcją jest dowódca zespołu. W przypadku zarejestrowanego użytkownika system podpowiada automatycznie, którą opcję zaznaczyć.
    - Uczestnik indywidualny widzi formularz standardowy opisany poniżej.
    - Dowódca zespołu posiada dodatkowo możliwość podania danych osobowych pozostałych członków zespołu.
    - Koordynator szkoły posiada możliwość zamieszczenia większej liczby prac wraz z danymi uczniów/zespołów, którzy je wykonali. Status koordynatora nadawany jest zarejestrowanym użytkownikom przez administratora systemu.


.. req:: Standardowy formularz zgłoszeniowy obowiązkowo składa się z pól: imię i nazwisko, adres e-mail, załączona praca, zgoda na przetwarzanie danych osobowych i akceptacja regulaminu.
    :id: REQ_24
    :osoba: 
    :priorytet: wysoki

.. req:: System musi umożliwiać wgrywanie prac w formatach png, jpg, … o maksymalnym rozmiarze do 20 MB (definiowanym dla każdej pracy).
    :id: REQ_25
    :osoba:
    :priorytet: wysoki

.. req:: Pozostałe dane takie jak nazwa szkoły, adres zamieszkania, data urodzenia uczestnika itp. wyświetlane są w formularzu w zależności od specyfikacji konkursu na etapie ogłaszania go na platformie.
    :id: REQ_26
    :osoba:
    :priorytet: średni

.. req:: Zgoda RODO i akceptacja regulaminu realizowana jest w formie zaznaczenia checkboxa. (* Przy wdrożeniu systemu wymagana jest konsultacja z działem prawnym odnośnie przyjętego rozwiązania)
    :id: REQ_27
    :osoba:
    :priorytet: wysoki

.. req:: System powinien prawidłowo rozróżniać indywidualnych użytkowników i nie pozwalać im na więcej zgłoszeń niż zdefiniowano dla danego konkursu.
    :id: REQ_28
    :osoba:
    :priorytet: średni

    - Unikalność użytkowników rozróżniana jest na podstawie adresów e-mail.
    - W przypadku kolejnego zgłoszenia przez tę samą osobę (adres e-mail), które jest niedozwolone, wyświetlany jest stosowny komunikat.
    - W przypadku zgłoszeń przez koordynatora szkoły, to on odpowiada za regulaminowe zgłoszenie swoich podopiecznych. Przypadki naruszeń regulaminu są rozpatrywane przez jury indywidualnie.

.. req:: Formularz posiada funkcjonalność aktywnego sprawdzania poprawności wpisanych danych (np. sprawdza poprawność maila bądź czy imię nie zawiera cyfr).
    :id: REQ_29
    :osoba:
    :priorytet: średni

.. req:: System powinien umożliwić administratorom dowolne edytowanie i zarządzanie zgłoszeniami
    :id: REQ_30
    :osoba:
    :priorytet: średni

    - Administrator może dowolnie przeglądać zgłoszenia
    - Może wypełniać i zmieniać zawartość pól w bazie danych
    - Administrator może dodać zgłoszenie ręcznie na przykład za indywidualną prośbą uczestnika

.. req:: System pozwala na pobieranie (ewentualnie wyświetlanie podglądu) plików nadesłanych przez uczestników
    :id: REQ_31
    :osoba:
    :priorytet: wysoki

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
    - Istnieje możliwość filtrowania prac oznaczonych gwiazdką (faworyci), krzyżykiem (odrzuceni) oraz prac jeszcze nieocenionych przez danego jurora.

.. req:: System ma umożliwiać ocenę pracy zgodnie z przyjętymi kryteriami.
    :id: REQ_34
    :osoba:
    :priorytet:

    - Juror wpisuje wartość zgodnie z ustaloną skalą dla każdego kryterium.
    - Zawsze dostępne jest pole “Uwagi” na komentarz tekstowy.
    - Jurorzy mają możliwość segregowania prac poprzez oznaczenie je gwiazdką (takie, które przejdą do finału) oraz czerwonym krzyżykiem (wstępnie odrzucone).
    - Oznaczenie pracy krzyżykiem lub gwiazdką można zmieniać w dowolnym momencie.

.. req:: Po ocenie pracy przez każdego jurora system oblicza i wyświetla przy niej średnią i medianę ocen dla każdej kategorii oraz łącznie.
    :id: REQ_35
    :osoba:
    :priorytet: średni

8. Raportowanie
--------------------

.. req:: System ma umożliwiać generowanie statystyk na temat uczestnictwa w konkursie zawierające: liczbę uczestników konkursu, liczbę zgłoszeń prac konkursowych, *liczbę szkół biorących udział, *regiony pochodzenia uczestników, *dane statystyczne na temat wieku uczestników.
    :id: REQ_36
    :osoba:
    :priorytet: średni

.. req:: System ma umożliwiać generowanie raportu o zwycięzcach konkursu zawierające: dane osobowe zwycięzców możliwe do upublicznienia, ich prace konkursowe, zajęte miejsce / informacje o wyróżnieniu, *średnie ocen prac
    :id: REQ_37
    :osoba:
    :priorytet: niski

.. req:: *System może umożliwiać automatyczne generowanie dyplomu dla zwycięzców.
    :id: REQ_38
    :osoba:
    :priorytet: niski