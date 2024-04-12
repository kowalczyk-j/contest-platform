# Platforma konkursowa dla fundacji BoWarto

## Cel projektu

Implementacja internetowej platformy konkursowej do rejestracji zgłoszeń uczestników, które zawierają prace artystyczne. Aplikacja webowa umożliwi właścicielom fundacji "Bo Warto" powiadomienie odbiorców z bazy mailingowej o nowym konkursie, zarządzanie trwającymi konkursami, weryfikację formularzy zgłoszeniowych, ocenę prac i generowanie statystyk. System ma być dostępny po przekierowaniu z zakładki istniejącej już strony www.fundacjabowarto.pl.

## Konfiguracja środowiska

W projekcie korzystamy z Poetry, opartego o pyproject.toml, który jest narzędziem do zarządzania zależnościami w projekcie Pythona.

1. **Instalacja Poetry**: Upewnij się, że masz zainstalowany Python w wersji 3.10. Następnie zainstaluj Poetry za pomocą polecenia pipx, które przeprowadzi instalację w wyizolowanym środowisku wirtualnym:

   ```bash
   pip install pipx
   pipx ensurepath
   pipx install poetry
   ```

2. **Inicjacja środowiska wirtualnego**: Przejdź do katalogu backend w terminalu i uruchom:

   ```bash
   poetry env list
   ```
   Jeśli żadne środowisko wirtualne nie zostało wylistowane, utwórz je i aktywuj za pomocą polecenia:

   ```bash
   poetry env use python3
   ```

3. **Przygotowanie bazy danych i pakietów frontendowych**: Upewnij się, że contest_platform_database została prawidłowo utworzona i skonfigurowana zgodnie z instrukcją podaną poniżej.

4. **Instalacja pakietów**: W celu instalacji pakietów użyj komendy:

   ```bash
   poetry install
   ```

5. **Uruchamianie projektu skryptem**: Aby uruchomić projekt w środowisku wirtualnym zarządzanym automatycznie przez Poetry, wywołaj skrypt run.sh z katalogu backend:

   ```bash
   poetry run ./run.sh
   ```
   Skrypt może wymagać jednorazowo nadania mu praw do wykonywania za pomocą komendy:

   ```bash
   chmod +x run.sh
   ```

5. **Dodawanie zależności**: Aby dodać zależności do pliku pyproject.toml, użyj komend:

   ```bash
   poetry add <nazwa pakietu>
   poetry lock
   ```
   Pamiętaj, że plik `Poetry.lock` automatycznie zapisuje dokładne wersje zainstalowanych pakietów, aby zapewnić spójność środowiska na różnych maszynach. Przy kolejnych uruchomieniach projektu, zaleca się używanie poleceń `poetry install` w celu zainstalowania zależności zdefiniowanych w pliku `pyproject.toml`.

## Baza danych

Projekt skonfigurowany jest do pracy z bazą PostgreSQL. Aby aplikacja instancja `django` działała poprawnie, powinieneś na swojej maszynie skonfigurować serwer `postgres`, i uruchomić go na porcie `5432`.

1. **Instalacja postgres**: Aby zainstalować serwer postgres na swojej maszynie `linux` wykonaj:
   ```bash
   sudo apt install postgresql
   ```
2. **Uruchomienie serwera**: Następnie aby uruchomić serwer użyj:
   ```bash
   sudo service postgresql start
   ```
   Domyślnie serwer uruchamiać będzie się lokalnie, czyli na `localhost`, na porcie `5432`. W celu zmiany musisz zmienić te atrybuty w pliku konfiguracyjnym bazy.

3. **Interakcja**: Możesz połączyć się z serwerem za pomocą dowolnego klienta `postgres`.

- Aby zrobić to za pomocą `psql` wykonaj:
  ```bash
  sudo -u postgres psql
  ```
- Aby wyjść z klienta `psql` wykonaj:
  ```bash
  exit
  ```

4. **Konfiguracja bazy danych**: Teraz gdy masz dostęp do serwisu postgres, możesz stworzyć odpowiednią bazę:

   1. Sprawdź, czy w pliku konfiguracyjnym django baza została skonfigurowana poprawnie. Aby to zrobić, znajdź plik `contest-platform/backend/backend/settings.py`. W tym pliku odnajdź sekcję `DATABASES`, jeśli jej nie ma, stwórz ją. Powinna ona mieć następującą strukturę:
      ```python
      DATABASES = {
      "default": {
         "ENGINE": "<typ_silnika>",
         "NAME": "<nazwa_bazy_danych>",
         "USER": "<nazwa_użytkownika>",
         "PASSWORD": "<hasło>",
         "HOST": "<adres_hosta>",
         "PORT": "<numer_portu>",
         }
      }
      ```
      W pliku powinny znajdować się już domyślne dane konfiguracyjne. 

   2. Stwórz bazę o zadanych bądź wybranych atrybutach. Aby to zrobić, po wejściu do klienta `psql` wykonaj:
      ```sql
      CREATE DATABASE contest_platform_database;
      ```
      Następnie stwórz odpowieniego użytkownika, z odpowiednimi uprawnieniami (hasło przykładowe używane tylko w środowisku testowym):

      ```sql
      CREATE ROLE admin WITH SUPERUSER LOGIN ENCRYPTED PASSWORD 'admin';
      ```
      Po poprawnym wykonaniu powyższych instrukcji, django serwerdjango powinien być w stanie połączyć się z bazą danych.
      
      UWAGA! Do poprawnego zalogowania się na konto administratora Django, wymagane jest utworzenie superużytkownika za pomocą komendy
      ```python
      python manage.py createsuperuser
      ```
   3. Jeśli chcesz wykonwyać polecenia `SQL` w bazie danych, użyj następującego polecenia by połączyć się z nią przez klienta `psql`:
      ```sql
      \c '<nazwa_bazy_danych>'
      ```

5. **Zatrzymanie serwera**: Aby zatrzymać serwer po zakończeniu pracy, użyj:
   ```bash
   sudo service postgresql stop
   ```

## Serwer frontend

W projekcie frontend piszemy w React. Aby uruchomić serwer React, wykonaj następujące kroki:

1. **Konfiguracja Nodejs i npm**: Aby sprawdzić użyj poniższych komend w terminalu:

   ```
   node -v
   npm -v
   ```

   Jeżeli pokazuje ci się zainstalowa wersja to znaczy, że node i npm są zainstalowane.
   Jeżęli Nodejs i npm nie są zainstalowane, użyj:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```
   Po pobraniu zrestartuj terminal, następnie:
   ```bash
   nvm install node
   ```
   W tym momencie powinieneś być w stanie uruchomić skrypt run.sh w katalogu backend.

1. **Ręczne uruchamianie serwera frontend**

   Node i npm powinny być już zainstalowane, teraz należy pobrać przypisane do projektu pakiety poprzez:
   ```bash
   npm install
   ```
   
   Następnie uruchamiamy serwer react:
   ```bash
   npm run dev
   ```
   
   Serwer powinien być uruchomiony i dostępny na porcie: localhost:5173

## Konteneryzacja
Aby uruchomić kontener, dostosuj ustawienia bazy danych do hosta, który jest domyślnym serwerem PostgreSQL w dockerze. W tym celu znajdź plik `contest-platform/backend/backend/settings.py`. W tym pliku odnajdź sekcję `DATABASES`i zmień parametr HOST z 'localhost' na 'db'.
   ```python
      DATABASES = {
      "default": {
         "HOST": "db",
         }
      }
   ```
Następnie zbuduj obrazy i uruchom kontenery z katalogu głównego projektu (zaleca się przy włączonym Docker Desktop) za pomocą komendy:
```bash
   docker-compose up --build
```

Jeżeli obrazy kontenerów zostały już zbudowane, wywołuj komendę bez flagi '--build'.

## Dokumentacja

W celu tworzenia dokumentacji używamy modułu Sphinx. Poniżej widnieje krótka instrukcja korzystania z niego w naszym projekcie.

- Sphinx wykorzystuje pliki `.rst` z własnym syntaxem, w których definiować można elementy dokumentacji.
- Rozszerzenie `autodoc` pozwala na automatyczne generowanie dokumentacji. `autodoc` tworzy pliki `.rst` po wykonaniu komendy `make html` w folderze `/docs`.
- Aby dodać moduł do dokumentacji nawiguj do pliku `/docs/source/index.html` w którym można dodawać poszczególne moduły z wykorzystaniem syntaxu Sphinxa.

1. **Generowanie dokumentacji**: Sphinx generuje dokumentację w postaci `html`. Aby to zrobić nawiguj do folderu docs i uruchom:

   ```bash
   cd docs
   make html
   ```

   Sphinx umieści wygenerowane pliki w folderze `docs/build/html`

2. **Wyświetlanie**: Aby wyświetlić plik użyj:
   ```bash
   open build/html/index.html
   ```
   bądź znajdź nawiguj do pliku i otwórz w dowolnej przeglądarce.
