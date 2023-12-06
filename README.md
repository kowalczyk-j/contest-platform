# Platforma konkursowa dla fundacji BoWarto

## Cel projektu

Implementacja internetowej platformy konkursowej do rejestracji zgłoszeń uczestników, które zawierają prace artystyczne. Aplikacja webowa umożliwi właścicielom fundacji "Bo Warto" powiadomienie odbiorców z bazy mailingowej o nowym konkursie, zarządzanie trwającymi konkursami, weryfikację formularzy zgłoszeniowych, ocenę prac i generowanie statystyk. System ma być dostępny po przekierowaniu z zakładki istniejącej już strony www.fundacjabowarto.pl.

## Konfiguracja środowiska

W projekcie korzystamy z Pipenv, który jest narzędziem do zarządzania zależnościami w projekcie Pythona, łączące w sobie funkcje pip (do instalacji pakietów) i virtualenv (do izolowania środowiska).

1. **Instalacja Pipenv**: Upewnij się, że masz zainstalowany Python w wersji 3.12, lub `pyenv`, którego pipenv użyje do zainstalowania odpowiedniej wersji pythona. Następnie zainstaluj Pipenv za pomocą polecenia pip:

   ```bash
   pip install pipenv
   ```

2. **Inicjacja projektu**: Przejdź do głównego katalogu swojego projektu w terminalu i uruchom:

   ```bash
   pipenv install
   ```

   Komenda ta z wykorzystaniem `Pipfile` stworzy odpowiednie środowisko wirtualne do pracy z projektem.

3. **Aktywacja środowiska wirtualnego**: Aby aktywować środowisko wirtualne stworzone przez Pipenv, użyj:

   ```bash
   pipenv shell
   ```

4. **Uruchamianie skryptów**: Aby uruchomić skrypty w środowisku Pipenv, użyj:

   ```bash
   pipenv run nazwa_skryptu.py
   ```

   lub jeśli aktywne jest środowisko po wcześniejszeym użyciu `pipenv shell`, po prostu

   ```bash
   python nazwa_skryptu.py

   ```

5. **Dezaktywacja środowiska wirtualnego**: Aby wyjść z wirtualnego środowiska, użyj komendy:

   ```bash
   exit
   ```

6. **Instalacja pakietów**: W celu instalacji pakietów i tym samym dodawania ich do paczki użyj komendy

   ```bash
   pipenv install nazwa_pakietu
   ```

   Wykonanie tej komendy zmieni Pipfile i Pipfile.lock. Możesz również wprowadzać ręczne zmiany do Pipfile, lecz pamiętaj, by każdorazowo po takowej zmianie uruchamiać komendę `pipenv install` by wygenerować `Pipfile.lock` i stworzyć odpowiednie, aktualne środowisko.

Pamiętaj, że plik `Pipfile.lock` automatycznie zapisuje dokładne wersje zainstalowanych pakietów, aby zapewnić spójność środowiska na różnych maszynach. Przy kolejnych uruchomieniach projektu, zaleca się używanie poleceń `pipenv install` w celu zainstalowania zależności zdefiniowanych w pliku `Pipfile`.

## Uruchomienie serwera backend

W projekcie backend piszemy w Django. Aby uruchomić serwer Django, wykonaj następujące kroki:

1. **Migracje bazy danych**: Wykonaj migracje, aby zastosować zmiany w bazie danych:

   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Uruchomienie serwera**: Aby uruchomić serwer deweloperski, wpisz poniższą komendę:

   ```
   python manage.py runserver
   ```

   Serwer będzie dostępny pod adresem domyślnym `http://127.0.0.1:8000/`.

3. **Otwórz aplikację w przeglądarce**: Wejdź na `http://127.0.0.1:8000/` w przeglądarce internetowej, aby zobaczyć działającą aplikację Django.

4. **Zmiana portu**:Możesz zmienić port, na którym działa serwer, dodając parametr `-p` lub `--port`. Na przykład, aby uruchomić serwer na porcie 8080, wpisz:

   ```
   python manage.py runserver 8080
   ```

- W trybie deweloperskim serwer automatycznie przeładowuje się po wprowadzeniu zmian w kodzie, więc nie musisz ręcznie ponownie uruchamiać serwera za każdym razem.

## Uruchomienie serwera frontend

W projekcie frontend piszemy w React. Aby uruchomić serwer React, wykonaj następujące kroki:

1. **Sprawdź czy masz zainstalowany Nodejs i npm**: Aby sprawdzić użyj poniższych komend w terminalu:

   ```
   node -v
   npm -v
   ```

   Jeżeli pokazuje ci się zainstalowa wersja to znaczy, że node i npm są zainstalowane.

2. **Pobierz Nodejs i npm**: Upewnij się, że masz pobrany Nodejs i npm lub pobierz dla swojej platformy:

   https://nodejs.org/en/download

3. **Uruchomienie serwera**: Aby uruchomić serwer deweloperski, wpisz poniższą komendę:

   ```
   npm run dev
   ```

   Serwer będzie dostępny pod adresem domyślnym `http://localhost:5173/`.

## Baza danych

Projekt skonfigurowany jest do pracy z bazą PostgreSQL. Aby aplikacja instancja `django` działała poprawnie, powinieneś na swojej maszynie skonfigurować serwer `postgres`, i uruchomić go na porcie `5432`.

1. **Instalacja postgres**: Aby zainstalować serwer postgres na swojej maszynie `linux` wykonaj:
   ```
   sudo apt install postgresql
   ```
2. **Uruchomienie serwera**: Następnie aby uruchomić serwer użyj:
   ```
   sudo service postgresql start
   ```
3. **Interakcja**: Możesz połączyć się z serwerem za pomocą dowolnego klienta `postgres`.

- Aby zrobić to za pomocą `psql` wykonaj:
  ```
  sudo -u postgres psql
  ```
- Aby wyjść z klienta `psql` wykonaj:
  ```
  exit
  ```

4. **Zatrzymanie serwera**: Aby zatrzymać serwer użyj:
   ```
   sudo service postgresql stop
   ```

## Dokumentacja

W celu tworzenia dokumentacji używamy modułu Sphinx. Poniżej widnieje krótka instrukcja korzystania z niego w naszym projekcie.

- Sphinx wykorzystuje pliki `.rst` z własnym syntaxem, w których definiować można elementy dokumentacji.
- Rozszerzenie `autodoc` pozwala na automatyczne generowanie dokumentacji. `autodoc` tworzy pliki `.rst` po wykonaniu komendy `make html` w folderze `/docs`.
- Aby dodać moduł do dokumentacji nawiguj do pliku `/docs/source/index.html` w którym można dodawać poszczególne moduły z wykorzystaniem syntaxu Sphinxa.

1. **Generowanie dokumentacji**: Sphinx generuje dokumentację w postaci `html`. Aby to zrobić nawiguj do folderu docs i uruchom:

   ```
   cd docs
   make html
   ```

   Sphinx umieści wygenerowane pliki w folderze `docs/build/html`

2. **Wyświetlanie**: Aby wyświetlić plik użyj:
   ```
   open build/html/index.html
   ```
   bądź znajdź nawiguj do pliku i otwórz w dowolnej przeglądarce.

## Konwencja

Dokumentacja, docstringi, komentarze - w języku polskim

Kod i nazwy plików - w języku angielskim

Nazwy zmiennych i metod - snake_case

Nazwy klas - PascalCase
