find . -name "*.js" | while read -r file
do
  echo "/**" > tempfile
  echo " * @license" >> tempfile
  echo " * Copyright 2014 David Wolverton" >> tempfile
  echo " * Available under MIT license <https://raw.githubusercontent.com/dwolverton/my/master/LICENSE.txt>" >> tempfile
  echo " */" >> tempfile

  cat "$file" >> tempfile;
  mv tempfile "$file";
done