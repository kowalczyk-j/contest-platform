User stories
---------------

**Aktorzy**

* **Uczestnik konkursu:** Dowolna osoba zainteresowana udziałem w konkursie. Posiada dostęp do platformy, aby przeglądać dostępne konkursy. Musi utworzyć konto, aby zgłosić się do udziału w wybranym konkursie.
* **Organizator konkursu:** Pracownik fundacji "Bo Warto" odpowiedzialny za tworzenie, zarządzanie i nadzorowanie konkursów na platformie. Posiada pełne prawa do tych funkcjonalności.
* **Członek jury:** Osoba posiadająca umiejętności i wiedzę związaną z konkretnym obszarem konkursu. Ocenia prace uczestników i wnosi wkład w proces wyłaniania zwycięzców. Aby móc oceniać pracę, musi się zalogować na utworzone przez administratora konto.

**Aktor - Uczestnik Konkursu**

1. **Przeglądanie Trwających Konkursów**

   *Jako uczestnik konkursu,* chcę móc łatwo przeglądać trwające konkursy, aby dowiedzieć się, które z nich są aktualnie otwarte i dostępne do wzięcia udziału.

   *Opis:* Uczestnik wchodzi na platformę konkursową. Na stronie głównej widzi listę trwających konkursów w formie kafelków. Każdy kafelek zawiera informacje o nazwie konkursu, kategorii, terminie zakończenia, nagrodach i regulaminie. Po kliknięciu na wybrany konkurs, uczestnik przechodzi do formularza zgłoszeniowego.

2. **Wypełnianie Formularza Zgłoszeniowego**

   *Jako uczestnik,* chcę z łatwością wypełnić formularz na platformie konkursowej, aby wziąć udział w konkursie.

   *Opis:* Po wybraniu konkursu, uczestnik przechodzi do formularza zgłoszeniowego. Intuicyjny interfejs umożliwia wprowadzenie danych osobowych, opisu prac oraz załadowanie plików zgłoszeniowych (jeśli wymagane). Po wypełnieniu formularza uczestnik otrzymuje potwierdzenie przesłania zgłoszenia.

3. **Potwierdzenie Zgłoszenia**

   *Jako uczestnik,* chcę otrzymać komunikaty o błędach w formularzu i potwierdzenie po wysłaniu zgłoszenia.

   *Opis:* Formularz reaguje na błędy (np. niewypełnione pola, niezałączone pliki). Po poprawnym zgłoszeniu prac, uczestnik otrzymuje potwierdzenie e-mailem. Potwierdzenie zawiera podsumowanie przesłanych prac i datę zgłoszenia.

**Aktor - Organizator Konkursu**

1. **Definiowanie Regulaminu i Zasad Konkursów**

   *Jako organizator konkursu,* chcę mieć możliwość zdefiniowania regulaminu i zasad nowych konkursów.

   *Opis:* Pracownik fundacji loguje się do panelu administracyjnego, gdzie może zdefiniować nowe konkursy (nazwa, kategorie, terminy, nagrody, regulamin). Po zapisaniu zmian konkurs jest uruchamiany i dostępny dla uczestników.

2. **Wysyłanie maili do organizacji zainteresowanych konkursem**

   *Jako organizator konkursu,* chcę mieć możliwość łatwego tworzenia i zarządzania kampaniami e-mailowymi, aby powiadomić odbiorców o nowych konkursach.

   *Opis:* Organizator loguje się do systemu i przechodzi do narzędzi do zarządzania kampaniami. Wybiera grupę docelową, tworzy treść e-maila informacyjnego, wybiera obszar placówek docelowych. Po wysłaniu kampanii monitoruje jej skuteczność.

3. **Zarządzanie Zgłoszeniami**

   *Jako organizator,* chcę móc zarządzać danymi uczestników i zgłoszeniami.

   *Opis:* W sekcji zarządzania zgłoszeniami pracownik ma dostęp do listy zgłoszeń w danym konkursie. Może je przeglądać, potwierdzać lub odpowiadać (e-mailem).

**Aktor - Członek Jury**

1. **Logowanie do Konkretnego Konkursu**

   *Jako członek Jury,* chcę mieć możliwość łatwego logowania do wybranego konkursu w czasie trwania oceny prac.

   *Opis:* Członek jury otrzymuje dane logowania do panelu oceniania lub tworzy konto, a administrator nadaje mu prawa jury. Po zalogowaniu system przekierowuje go do panelu z listą prac do oceny.

2. **Ocenianie Prac**

   *Jako juror konkursowy,* chcę mieć możliwość skutecznego i precyzyjnego oceniania prac w podanych kategoriach.

   *Opis:* Juror przegląda prace w wybranym konkursie i przyznaje punkty według kryteriów. Każde kryterium ma minimalną i maksymalną liczbę punktów. Juror może dodać uwagi słowne.
